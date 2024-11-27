import { auth } from "../auth";

export const runtime = "edge";

export default async function ProfilePage() {
  const session = await auth();
  /*
        ? console.log(JSON.stringify(session));

        {
            user: {
                id: '40fee5f0-dbb0-4a83-b313-2e7e1772bccb',
                name: 'Abdul Raheem',
                email: 'abdulraheemsayyed22@gmail.com',
                emailVerified: null,
                image: 'https://lh3.googleusercontent.com/a/ACg8ocL3tGLw2rYePL0Kj71Q58ovxDUldVxD6PYpUX5FJudD2UKIEynu=s96-c'
            },
            sessionToken: '801f59d9-bbaf-4087-b878-3e85be27ba58',
            userId: '40fee5f0-dbb0-4a83-b313-2e7e1772bccb',
            expires: '2024-12-19T07:58:43.658Z'
        }

    */

  return (
    <div>
      {session && (
        <div className="text-black font-bold">{JSON.stringify(session)}</div>
      )}
    </div>
  );
}
