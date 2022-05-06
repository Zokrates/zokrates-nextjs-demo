import {
  Button,
  Code,
  Flex,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { readFile } from "fs/promises";
import { FormEvent, useEffect, useState } from "react";
import { ZoKratesProvider } from "zokrates-js";
import { Container } from "../components/Container";
import { MagicSquare } from "../components/MagicSquare";

const initialize = async () => (await import("zokrates-js")).initialize();

const solution = [
  ["31", "73", "7"],
  ["13", "37", "61"],
  ["67", "1", "43"],
];

const Index = (props) => {
  const [zokratesProvider, setZokratesProvider] =
    useState<ZoKratesProvider>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      let provider = await initialize();
      setZokratesProvider(provider);
    };
    load();
  }, []);

  const [values, setValues] = useState([
    ["", "", "7"],
    ["13", "37", ""],
    ["", "", ""],
  ]);

  const onValueChange = (r: number, c: number, value: string) => {
    let newValues = values.slice();
    newValues[r][c] = value;
    setValues(newValues);
  };

  const toast = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      try {
        const program = Uint8Array.from(Buffer.from(props.program, "hex"));
        const inputs = values.flat();

        const { witness } = zokratesProvider.computeWitness(program, [
          ...inputs,
          "111",
        ]);

        const provingKey = new Uint8Array(Buffer.from(props.provingKey, "hex"));
        const proof = zokratesProvider.generateProof(
          program,
          witness,
          provingKey
        );

        if (zokratesProvider.verify(props.verificationKey, proof)) {
          toast({
            title: "You got it!",
            description: "Your solution has been successfully verified :)",
            position: "top",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error("Verification failed");
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Whoops!",
          description: "Your solution seems to be incorrect :(",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setIsLoading(false);
    }, 300);
  };

  return (
    <Container height="100vh" justifyContent="center">
      <form onSubmit={(e) => onSubmit(e)}>
        <Stack
          spacing="1.5rem"
          width="100%"
          maxWidth="48rem"
          alignItems="center"
          pt="8rem"
          px="1rem"
        >
          <Flex direction="column" alignItems={"center"}>
            <MagicSquare
              values={values}
              onValueChange={(r, c, v) => onValueChange(r, c, v)}
              marginBottom="2"
            />
            <Text
              color="gray.500"
              fontSize="sm"
              onClick={() => setValues(solution)}
              cursor="pointer"
            >
              Show solution
            </Text>
          </Flex>
          <Text color="text" fontSize="lg">
            This is a{" "}
            <Text as="span" fontWeight="bold">
              Magic Square
            </Text>
            . This means that the numbers add up to the same total in every
            direction. Every row, column and diagonal should add up to{" "}
            <Code>111</Code>. Fill the missing fields and verify the solution
            using zero knowledge proofs!
          </Text>
          <Button
            isLoading={isLoading}
            loadingText="Verifying..."
            colorScheme="teal"
            variant="solid"
            type="submit"
          >
            Verify solution
          </Button>
        </Stack>
      </form>
      <Flex as="footer" py="8rem">
        <Text color="gray.500">
          Made by{" "}
          <Link color="teal" href="https://github.com/Zokrates/ZoKrates">
            ZoKrates Team
          </Link>
        </Text>
      </Flex>
    </Container>
  );
};

export async function getStaticProps() {
  const program = (await readFile("zkp/magic_square")).toString("hex");

  const verificationKey = JSON.parse(
    (await readFile("zkp/verification.key")).toString()
  );
  const provingKey = (await readFile("zkp/proving.key")).toString("hex");
  return {
    props: {
      program,
      verificationKey,
      provingKey,
    },
  };
}

export default Index;
