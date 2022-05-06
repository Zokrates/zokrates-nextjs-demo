import { HStack, StackProps, VStack, Text } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";

export type Value = {
  value?: string;
  solution: string;
  static?: boolean;
};

export type MagicSquareProps = {
  values: Value[][];
  onValueChange: (row: number, cell: number, value: string) => void;
};

export const MagicSquare = (props: MagicSquareProps & StackProps) => {
  const { values, onValueChange, ...stackProps } = props;
  const [showSolution, setShowSolution] = useState(false);

  return (
    <VStack w="200px" {...stackProps}>
      {values.map((row, r) => (
        <HStack key={r}>
          {row.map((value, c) => (
            <Input
              key={`${r}-${c}`}
              type="number"
              size="lg"
              textAlign="center"
              value={showSolution ? value.solution : value.value ?? ""}
              onChange={(e) => onValueChange(r, c, e.currentTarget.value)}
              color={showSolution ? "gray.500" : "current"}
              readOnly={showSolution || value.static}
              max={100}
            />
          ))}
        </HStack>
      ))}
      <Text
        color="gray.500"
        onClick={() => setShowSolution(!showSolution)}
        fontSize="sm"
        cursor="pointer"
      >
        {showSolution ? "Hide" : "Show"} solution
      </Text>
    </VStack>
  );
};
