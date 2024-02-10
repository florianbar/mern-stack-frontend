import { useState } from "react";
import { useRouter } from "next/router";

import { Layout } from "../components/layout";
import { useHttpClient } from "../hooks/http-hook";
import { setToken, getToken } from "../utils/auth";
import ImageUpload from "../components/ImageUpload";

export default function Home() {
  const router = useRouter();

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const { isLoading, successMessage, errorMessage, sendRequest, clearError } =
    useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    let responseData;
    try {
      if (isLoginMode) {
        // send login request
        responseData = await sendRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email,
            password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);

        // send signup request
        responseData = await sendRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
      }

      // Throw error if no token
      if (!responseData.token) {
        throw new Error(responseData.message);
      }

      console.log(responseData);

      setToken(responseData.token);
      router.push("/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <button
        onClick={() => {
          setIsLoginMode(!isLoginMode);
          setName("");
          setEmail("");
          setPassword("");
        }}
      >
        {!isLoginMode ? "Login" : "Signup"}
      </button>
      <h1 className="text-3xl font-bold mb-4">
        {isLoginMode ? "Login" : "Signup"}
      </h1>
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
      <form method="POST" onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <input
            type="text"
            name="name"
            placeholder="name"
            className="block border border-slate-500 p-3 rounded mb-4 w-full"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isLoading}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="email"
          className="block border border-slate-500 p-3 rounded mb-4 w-full"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="block border border-slate-500 p-3 rounded mb-4 w-full"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
        />
        {!isLoginMode && (
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
        )}
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
  if (!!getToken(context)) {
    return {
      redirect: {
        destination: "/users",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
