import { Layout } from "../components/layout";
import { httpClient } from "../utils/http";
import { getToken } from "../utils/auth";

export default function Users({ users, errorMessage, authenticated }) {
  return (
    <Layout loggedIn={authenticated}>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      {errorMessage && (
        <div className="text-red-800 font-bold bg-red-200 mb-4 p-4">
          {errorMessage}
        </div>
      )}
      <ul>
        {users?.length > 0 &&
          users.map((user) => (
            <li key={user.id}>
              {user.name}{" "}
              <img
                className="w-32 h-auto"
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${user.image}`}
              />
            </li>
          ))}
      </ul>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const token = getToken(context);

  let users = null;
  const { sendRequest, errorMessage } = httpClient();
  const responseData = await sendRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
  );
  users = responseData.users;

  return {
    props: {
      users,
      errorMessage,
      authenticated: !!token,
    },
  };
}
