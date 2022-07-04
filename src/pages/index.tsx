import {
  Box,
  Button,
  Code,
  Flex,
  Grid,
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
import { cloneDeep } from "lodash";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Image from "next/image";
import ConclusionPicture from "../../public/conclusion.png";

const initialize = async () => (await import("zokrates-js")).initialize();

const solution = [
  ["31", "73", "7"],
  ["13", "37", "61"],
  ["67", "1", "43"],
];

const defaultValues = [
  ["", "", "7"],
  ["13", "37", ""],
  ["", "", ""],
];

const Index = (props) => {
  const [zokratesProvider, setZokratesProvider] =
    useState<ZoKratesProvider>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState(null);

  useEffect(() => {
    const load = async () => {
      let provider = await initialize();
      setZokratesProvider(provider);
    };
    load();
  }, []);

  const [values, setValues] = useState(defaultValues);

  const onValueChange = (r: number, c: number, value: string) => {
    let newValues = values.slice();
    newValues[r][c] = value;
    setValues(newValues);
  };

  const toast = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setProof(null);

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

        setProof(proof);
        toast({
          title: "Yay!",
          description: "Your solution seems to be correct :)",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
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

  const verify = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (zokratesProvider.verify(props.verificationKey, proof)) {
        toast({
          title: "Yes!",
          description: "Generated proof has been successfully verified :)",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Whoops!",
          description: "Verification failed :(",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }, 300);
  };

  const { nextStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetSteps = () => {
    setValues(defaultValues);
    setProof(null);
    reset();
  };

  return (
    <Container p={4} justifyContent="center" bg="white">
      <Flex maxWidth={"1000px"}>
        <Steps activeStep={activeStep} orientation="vertical">
          <Step label={"Alice the Prover"} key={"Alice the Prover"} py={2}>
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack
                spacing="1.5rem"
                width="100%"
                maxWidth="48rem"
                alignItems="center"
                p="1rem"
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
                    onClick={() => setValues(cloneDeep(solution))}
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
                  . This means that the numbers add up to the same total in
                  every direction. Every row, column and diagonal should add up
                  to <Code>111</Code>. Fill the missing fields and prove to the
                  verifier that you know the solution without revealing the
                  values!
                </Text>
                <Flex gap={2}>
                  <Button
                    isLoading={isLoading}
                    loadingText="Proving..."
                    colorScheme="teal"
                    variant="solid"
                    type="submit"
                  >
                    Generate a proof
                  </Button>
                  {proof && (
                    <Button>
                      <Button variant="solid" type="button" onClick={nextStep}>
                        Next step
                      </Button>
                    </Button>
                  )}
                </Flex>
                {proof && (
                  <Grid>
                    <Code
                      whiteSpace="pre"
                      overflow="scroll"
                      textAlign="left"
                      p={2}
                      mb={2}
                    >
                      {JSON.stringify(proof, null, 2)}
                    </Code>
                  </Grid>
                )}
              </Stack>
            </form>
          </Step>
          <Step label={"Bob the Verifer"} key={"Bob the Verifier"} py={2}>
            <Stack
              spacing="1.5rem"
              width="100%"
              maxWidth="48rem"
              alignItems="center"
              p="1rem"
            >
              <Image src={ConclusionPicture} alt="conclusion" />
              <Text color="text" fontSize="lg">
                Did Alice run the computation successfully? Does Alice know the
                right solution? Good questions, let's find out.
              </Text>
              <Flex gap={2}>
                <Button
                  isLoading={isLoading}
                  loadingText="Verifying..."
                  colorScheme="teal"
                  variant="solid"
                  type="button"
                  onClick={verify}
                >
                  Verify
                </Button>
                <Button variant="solid" type="button" onClick={resetSteps}>
                  Reset
                </Button>
              </Flex>
            </Stack>
          </Step>
        </Steps>
      </Flex>
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
  const source = (await readFile("zkp/magic_square.zok")).toString();
  const program = (await readFile("zkp/magic_square")).toString("hex");

  const verificationKey = JSON.parse(
    (await readFile("zkp/verification.key")).toString()
  );
  const provingKey = (await readFile("zkp/proving.key")).toString("hex");
  return {
    props: {
      source,
      program,
      verificationKey,
      provingKey,
    },
  };
}

export default Index;
