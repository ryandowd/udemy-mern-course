import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

// import { useState, useCallback, useEffect, useRef } from "react";

// // NOTE: This is a hook. A hook should always
// // start with 'use' XYZ. Hooks are used to simplify
// // commonly reoccuring code.
// export const useHttpClient = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState();

//   const activeHttpRequests = useRef([]);

//   // NOTE: We are using 'useCallback()' here so that if this
//   // function causes the re-rendering of a component which then
//   // re-calls this function, then it won't fire again and cause
//   // an infinite loop. Thus it only allows this to run once.
//   const sendRequest = useCallback(
//     async (url, method = "GET", body = null, headers = {}) => {
//       try {
//         setIsLoading(true);

//         // The reason we are using this 'abort controller' is to
//         // stop the browser from running the function when the
//         // 'useRefs' are no longer in view (i.e. when the component)
//         // that triggered the request is no longer rendered. It uses
//         // 'AbortController' which is a method available to all modern
//         // browsers. And we assign the abort controller to the request.
//         const httpAbortController = new AbortController();
//         activeHttpRequests.current.push(httpAbortController);

//         // Do the fetch
//         const response = await fetch(url, {
//           method,
//           body,
//           headers,
//           // NOTE: Now we can use this 'signal' value to abort the
//           // request if we need to. See below 'useEffect' for more.
//           signal: httpAbortController.signal,
//         });

//         const responseData = await response.json();

//         // Remove any requests in the list that have actually completed
//         activeHttpRequests.current = activeHttpRequests.current.filter(
//           (reqCtrl) => reqCtrl !== httpAbortController
//         );

//         // NOTE: 'response.ok' gets the value of truthy or falsey
//         // depending on if the response has returned a code of
//         // 200ish (true) or 500ish (false). This allows us to detect
//         // whether the response is truly a pass.
//         if (!response.ok) {
//           // If it fails, then send back the error message that we send
//           // back on the backend. If we end up throwing an error here
//           // then the code below this won't run. And instead the 'catch'
//           // block will be run.
//           throw new Error(responseData.message);
//         }

//         setIsLoading(false);
//         return responseData;
//       } catch (err) {
//         setError(err.message);
//         setIsLoading(false);
//         throw err;
//       }
//     },
//     []
//   );

//   const clearError = () => {
//     setError(null);
//   };

//   // NOTE: We can trigger 'useEffect()' to only run once
//   // by passing it an empty array. The array should hold any
//   // vars that useEffect needs to listen for changes to. Thus
//   // if there are no vars to listen to then it only fires once.
//   // NOTE: We return a function in this 'useEffect()' as a way to 'clean up'
//   // the component if it unmounts (this is how useEffect can be used).
//   useEffect(() => {
//     return () => {
//       // NOTE: So the logic below means we never let a request run if the component
//       // that sent it has been unmounted.
//       activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
//     };
//   }, []);

//   return { isLoading, error, sendRequest, clearError };
// };
