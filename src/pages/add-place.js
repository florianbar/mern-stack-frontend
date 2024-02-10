import { useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "../components/layout";
import { useHttpClient } from "../hooks/http-hook";
import { getToken } from "../utils/auth";
import ImageUpload from "../components/ImageUpload";

export default function AddPlace({ authenticated }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const { isLoading, successMessage, errorMessage, sendRequest } =
    useHttpClient();

  const submitHandler = async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("image", image);

      await sendRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout loggedIn={authenticated}>
      {isLoading && <div>Loading</div>}
      {errorMessage && (
        <div className="text-red-800 font-bold bg-red-200 mb-4 p-4">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-green-800 font-bold bg-green-200 mb-4 p-4">
          {successMessage}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">Add Place</h1>
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
        <input
          type="text"
          name="address"
          placeholder="address"
          className="block border border-slate-500 p-3 rounded mb-4 w-full"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          disabled={isLoading}
        />
        <ImageUpload
          id="image"
          onInput={(pickedFile, fileIsValid) => {
            if (!pickedFile || !fileIsValid) {
              setImage(null);
            } else {
              setImage(pickedFile);
            }
          }}
        />
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
  if (!token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      authenticated: !!token,
    },
  };
}
