import { useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import Link from "next/link";

import { Layout } from "../components/layout";
import { httpClient } from "../utils/http";
import { useHttpClient } from "../hooks/http-hook";
import { getToken } from "../utils/auth";

export default function UserPlaces({
  places,
  errorMessage,
  authenticated,
  userId,
}) {
  const router = useRouter();
  const {
    isLoading,
    successMessage,
    errorMessage: deleteErrorMessage,
    sendRequest,
    clearError,
  } = useHttpClient();

  const [placesList, setPlacesList] = useState(places);

  const handleDeletePlace = async (placeId) => {
    const token = getToken();

    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/places/${placeId}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // remove place from state
      const updatedPlacesList = placesList.filter(
        (place) => place.id !== placeId
      );
      setPlacesList(updatedPlacesList);
    } catch (err) {
      console.log(deleteErrorMessage || err);
    }
  };

  return (
    <Layout loggedIn={authenticated}>
      <h1 className="text-3xl font-bold mb-4">My Places</h1>
      {errorMessage && (
        <div className="text-red-800 font-bold bg-red-200 mb-4 p-4">
          {errorMessage}
        </div>
      )}
      {placesList?.length > 0 ? (
        <ul>
          {placesList.map((place) => (
            <li key={place.id} className="mb-2 space-x-1">
              - {place.title}{" "}
              <img
                className="w-32 h-auto"
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${place.image}`}
              />
              {place.creator === userId && (
                <>
                  <button
                    className="px-1 text-sm bg-stone-300"
                    type="button"
                    onClick={() => {
                      router.push(`/update-place/${place.id}`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-1 text-sm bg-stone-300"
                    type="button"
                    onClick={() => handleDeletePlace(place.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No places found.
          <br />
          <Link href="/add-place" className="text-blue-700 underline">
            Create place
          </Link>
        </p>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const token = getToken(context);
  if (!token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  // Get user places
  let places = null;
  const { userId } = jwt.decode(token);
  const { sendRequest, errorMessage } = httpClient();
  const responseData = await sendRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/places/user/${userId}`
  );
  places = responseData.places;

  return {
    props: {
      places,
      errorMessage,
      authenticated: !!token,
      userId,
    },
  };
}
