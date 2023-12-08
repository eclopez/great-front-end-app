"use client";
import { useState, useEffect, ChangeEvent, useCallback } from "react";

import {
  Badge,
  Flex,
  Heading,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  TextFieldInput,
  TextFieldRoot,
  TextFieldSlot,
} from "@radix-ui/themes";
import { ThickArrowUpIcon, ThickArrowDownIcon } from "@radix-ui/react-icons";

enum Currency {
  USD = "$",
  EUR = "€",
  GBP = "£",
  CNY = "¥",
  JPY = "¥",
}

const ENDPOINT_URL = "https://api.frontendeval.com/fake/crypto";

const formatCurrency = (value: number, currency: Currency): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
};

function Home() {
  const [currency, setCurrency] = useState<Currency>("USD" as Currency);
  const [amountChanged, setAmountChanged] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [coinValue, setCoinValue] = useState<number>(0);

  const updateAmount = (value: string): void => {
    const parsedAmount = parseFloat(value) || 0;
    if (!isNaN(parsedAmount)) {
      setAmount(parsedAmount);
    }
  };

  const updateCurrency = (value: Currency): void => {
    setCurrency(value);
  };

  const fetchPrice = useCallback(
    async (currency: Currency, track: boolean = false): Promise<void> => {
      if (amount <= 0) {
        return;
      }
      const response = await fetch(`${ENDPOINT_URL}/${currency}`);
      const { value } = await response.json();
      if (track) {
        setAmountChanged(value - coinValue);
      }
      setCoinValue(value);
    },
    [amount, coinValue]
  );

  useEffect(() => {
    const priceInterval: ReturnType<typeof setInterval> = setInterval(() => {
      fetchPrice(currency, true);
    }, 3000);
    return () => clearInterval(priceInterval);
  }, [coinValue, currency, fetchPrice]);

  useEffect(() => {
    fetchPrice(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ height: "100dvh" }}
    >
      <Heading mb="4" as="h1">
        WUC Currency Converter
      </Heading>
      <form>
        <Flex direction="row" gap="4">
          <TextFieldRoot>
            <TextFieldSlot>{Currency[currency]}</TextFieldSlot>
            <TextFieldInput
              placeholder="Enter an amount"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateAmount(e.target.value)
              }
            />
          </TextFieldRoot>
          <SelectRoot defaultValue={currency} onValueChange={updateCurrency}>
            <SelectTrigger />
            <SelectContent>
              {Object.keys(Currency).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Flex>
      </form>
      <Flex direction="row" mt="4" gap="2">
        <span>
          {formatCurrency(coinValue * amount, currency) || "0.00"} WUC
        </span>
        {amountChanged !== 0 && (
          <Badge color={amountChanged > 0 ? "green" : "red"} variant="surface">
            {amountChanged > 0 ? <ThickArrowUpIcon /> : <ThickArrowDownIcon />}
            {formatCurrency(amount * amountChanged, currency)}
          </Badge>
        )}
      </Flex>
    </Flex>
  );
}

export default Home;
