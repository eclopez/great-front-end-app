# Erik Lopez's Application Assignment for GreatFrontEnd

## Summary

I tackled the Crypto Converter exercise by using some of the same tech stack used at GreatFrontEnd: TypeScript and React with NextJS, and Radix UI.

I used NextJS 14 with the `app` directory and split the home page between `layout.tsx` and `page.tsx`. All of the action is in `page.tsx`. I started out with setting up the `Currency` enum and the `fetchPrice`, `formatTwoDecimals`, and `currencyMask` functions outside of the component in order to prevent from having to utilize `useCallback` in order to prevent them from being redefined on every render.

Inside the `Home` component, I decided to store `currency` of type `Currency`, along with the `amount`, `amountChanged`, and `coinValue` of the `number` type in the component's state. I'm also using the `useEffect` hook twice, once to fetch and update the price of the Wildly Unstable Coin on a fixed interval, and another to do so when one of the controls is changed. Also, I created a `useDebounce` hook to debounce the `amount` entered into the input field, so that the new price is fetched and the amount changed is calculated after the user stops typing for 500ms.

I also enhanced the accessibility by adding aria attributes where they made sense, including adding `aria-live="polite"` to the price display so that the screen reader will announce the new price and the value change when it is updated.

Finally, I added a simple `currencyMask` that accepts the text input's change event, masks the input with regular expressions, and returns the event. The `updateAmount` handler then takes this value and stores it in the `amount` state variable. This should be built out or replaced with a library since it's not perfect and doesn't handle edge cases like leading zeroes.
