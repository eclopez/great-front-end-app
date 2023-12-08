"use client";
import { useState, useEffect, ChangeEvent } from "react";
import useDebounce from "@/hooks/useDebounce";
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
const DEBOUNCE_TIME = 500;
const REFRESH_TIME = 10000;

const fetchPrice = async (currency: Currency): Promise<number> => {
  const response = await fetch(`${ENDPOINT_URL}/${currency}`);
  const { value } = await response.json();
  return value;
};

const formatTwoDecimals = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const currencyMask = (
  e: ChangeEvent<HTMLInputElement>
): ChangeEvent<HTMLInputElement> => {
  let maskedValue = e.target.value;
  maskedValue = maskedValue.replace(/\D/g, "");
  maskedValue = maskedValue.replace(/(\d)(\d{2})$/, "$1.$2");
  maskedValue = maskedValue.replace(/(?=(\d{3})+(\D))\B/g, ",");
  e.target.value = maskedValue;
  return e;
};

function Home() {
  const [currency, setCurrency] = useState<Currency>("USD" as Currency);
  const [amountChanged, setAmountChanged] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [coinValue, setCoinValue] = useState<number>(0);
  const debouncedAmount = useDebounce<number>(amount, DEBOUNCE_TIME);

  const updateAmount = (e: ChangeEvent<HTMLInputElement>): void => {
    const parsedAmount = parseFloat(e.target.value.replaceAll(",", "")) || 0;
    if (!isNaN(parsedAmount)) {
      setAmount(parsedAmount);
    }
  };

  const updateCurrency = (value: Currency): void => {
    setCurrency(value);
  };

  useEffect(() => {
    const priceInterval: ReturnType<typeof setInterval> = setInterval(
      async () => {
        if (amount !== 0) {
          const value = await fetchPrice(currency);
          setAmountChanged(value - coinValue);
          setCoinValue(value);
        }
      },
      REFRESH_TIME
    );
    return () => clearInterval(priceInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount, coinValue, currency]);

  useEffect(() => {
    async function updateValues() {
      if (amount !== 0) {
        const value = await fetchPrice(currency);
        setCoinValue(value);
      }
    }
    updateValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount, currency]);

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
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                updateAmount(currencyMask(e))
              }
            />
          </TextFieldRoot>
          <SelectRoot defaultValue={currency} onValueChange={updateCurrency}>
            <SelectTrigger aria-label="Currency to convert" />
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
      <Flex direction="row" mt="4" gap="2" aria-live="polite">
        <span>{`${formatTwoDecimals(coinValue * debouncedAmount)} WUC`}</span>
        {amountChanged !== 0 && (
          <Badge
            color={amountChanged > 0 ? "green" : "red"}
            variant="surface"
            tabIndex={0}
          >
            {amountChanged > 0 ? <ThickArrowUpIcon /> : <ThickArrowDownIcon />}
            {formatTwoDecimals(debouncedAmount * amountChanged)}
          </Badge>
        )}
      </Flex>
    </Flex>
  );
}

export default Home;
