/**
 * This component will have information about user profile cards etc.
 * create api for update user profile
 *
 */

import * as React from "react";
import Box from "@mui/material/Box";
import UpBarProfile from "@/components/Profile/UpBarProfile";
import LeftBarProfile from "@/components/Profile/LeftBarProfile";
import styles from "@/styles/Styles.module.scss";
import { GetUSer } from "@/types/types";
import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import { getSession } from "next-auth/react";

const Profile = ({
  userProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(userProfile);
  return (
    <Box className={styles.container} sx={{ width: "100%" }}>
      <UpBarProfile />
      <LeftBarProfile />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<{
  userProfile: GetUSer;
}> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);
  if (!session?.cookie) {
    const userProfile = "something gone wrong with credentials";
    return { props: { userProfile } };
  } else {
    const res = await fetch(
      `http://${process.env.AUTH_URL}/api/v1/users/currentUser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": session.cookie,
        },
      }
    );
    const userProfile = await res.json();

    return { props: { userProfile } };
  }
};

export default Profile;
