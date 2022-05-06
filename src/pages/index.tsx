import { Button, Code, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useState } from "react";
import { Container } from "../components/Container";
import { MagicSquare } from "../components/MagicSquare";

const Index = () => {
  const [values, setValues] = useState([
    // first row
    [
      { value: null, solution: "31" },
      { value: null, solution: "73" },
      { value: "7", solution: "7", static: true },
    ],

    // second row
    [
      { value: "13", solution: "13", static: true },
      { value: "37", solution: "37", static: true },
      { value: null, solution: "61" },
    ],

    // third row
    [
      { value: null, solution: "67" },
      { value: null, solution: "1" },
      { value: null, solution: "43" },
    ],
  ]);

  const onValueChange = (r: number, c: number, value: string) => {
    let newValues = values.slice();
    newValues[r][c] = {
      ...values[r][c],
      value,
    };
    console.log(newValues);
    setValues(newValues);
  };

  return (
    <Container height="100vh">
      <Stack
        spacing="1.5rem"
        width="100%"
        maxWidth="48rem"
        alignItems="center"
        pt="8rem"
        px="1rem"
      >
        <MagicSquare
          marginBottom="2"
          values={values}
          onValueChange={(r, c, v) => onValueChange(r, c, v)}
        />
        <Text color="text" fontSize="lg">
          This is a{" "}
          <Text as="span" fontWeight="bold">
            Magic Square
          </Text>
          . This means that the numbers add up to the same total in every
          direction. Every row, column and diagonal should add up to{" "}
          <Code>111</Code>. Fill the missing fields and verify the solution
          without revealing it!
        </Text>
        <Button
          // isLoading
          // loadingText="Verifying"
          colorScheme="teal"
          variant="solid"
        >
          Verify solution
        </Button>
      </Stack>
      <Flex as="footer" py="8rem">
        <Text color="dimgray">
          Made by{" "}
          <Link color="text" href="https://github.com/Zokrates/ZoKrates">
            ZoKrates Team
          </Link>
        </Text>
      </Flex>
    </Container>
  );
};

export default Index;
