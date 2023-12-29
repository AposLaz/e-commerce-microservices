import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Username",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Your Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials?.username && !credentials?.password) {
          throw new Error(
            JSON.stringify({
              errors: [
                { message: "You must provide a Username", field: "username" },
                { message: "You must provide a Password", field: "password" },
              ],
            })
          );
        } else if (!credentials?.username) {
          throw new Error(
            JSON.stringify({
              errors: [
                { message: "You must provide a Username", field: "username" },
              ],
            })
          );
        } else if (!credentials?.password) {
          throw new Error(
            JSON.stringify({
              errors: [
                { message: "You must provide a Password", field: "password" },
              ],
            })
          );
        }

        const res = await fetch(
          `http://${process.env.AUTH_URL as string}/api/v1/users/signin`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );

        const cookieSession = res.headers.getSetCookie()[0];
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            jwt: user.jwt,
            cookie: cookieSession,
          };
        }
        // Return null if user data could not be retrieved
        throw new Error(JSON.stringify({ errors: user.errors }));
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.name = user.username;
        token.cookie = user.cookie;
      } else if (account) {
        token.accessToken = account?.access_token ?? "";
      }

      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (token) {
        session.cookie = token?.cookie as string; //this is the session cookie for login
      }
      // pass the data that we want to access via session
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
export default NextAuth(authOptions);
