import { useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

import { Layout } from "../../components/layout";
import { httpClient } from "../../utils/http";
import { useHttpClient } from "../../hooks/http-hook";
import { getToken } from "../../utils/auth";

export default function UpdatePlace({ authenticated, place }) {
  const router = useRouter();

  const [title, setTitle] = useState(place.title);
  const [description, setDescription] = useState(place.description);

  const { isLoading, successMessage, errorMessage, sendRequest, clearError } =
    useHttpClient();

  const submitHandler = async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/places/${place.id}`,
        "PATCH",
        JSON.stringify({
          title,
          description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      // redirect to home page
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout loggedIn={authenticated}>
      <h1 className="text-3xl font-bold mb-4">Update Place</h1>
      <form method="POST" onSubmit={submitHandler}>
        <input
          type="text"
          name="title"
          placeholder="title"
          className="block border border-slate-500 p-3 rounded mb-4 w-full"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          className="block border border-slate-500 p-3 rounded mb-4 w-full"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isLoading}
        />
        <button
          type="button"
          className="bg-slate-300 text-white p-3 rounded mb-4 mr-2 text-slate-900"
          disabled={isLoading}
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-slate-500 text-white p-3 rounded mb-4"
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const token = getToken(context);
  const { id } = context.query;

  if (!token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  // Get single place
  let place = null;
  const { sendRequest, errorMessage } = httpClient();
  const responseData = await sendRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/places/${id}`,
    "GET"
  );
  place = responseData.place;

  console.log("place", place);

  return {
    props: {
      authenticated: !!token,
      place,
    },
  };
}
