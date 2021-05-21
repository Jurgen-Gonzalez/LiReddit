import { Box, Button, Flex, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{fetching: logoutFetching},logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // this makes it so that there is no query being made when you don't need it
    pause: isServer(),
  });
  let body = null;

  // data is loading
  if (fetching) {
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link> login </Link>
        </NextLink>
        <NextLink href="/register">
          <Link> register</Link>
        </NextLink>
      </>
    );
  } else {
    //user is logged in
    body = (
      <Flex>
        <Box>{data.me.username}</Box>
        <Button onClick={() => { logout(); }} 
        isLoading={logoutFetching}
        variant="link">logout</Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
