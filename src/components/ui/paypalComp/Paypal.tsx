import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

const paypalScriptOptions: PayPalScriptOptions = {
  "client-id":
    "AaUpVv8WDVM5uezwsQo79K6YBKmqm3EeLSOx5TFTX4RM2_ephwW68aJ4_ASXYPjbI8OyuXchwgkQ7bRl",
  currency: "USD",
};
function Button() {
  /**
   * usePayPalScriptReducer use within PayPalScriptProvider
   * isPending: not finished loading(default state)
   * isResolved: successfully loaded
   * isRejected: failed to load
   */
  const [{ isPending }] = usePayPalScriptReducer();
  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical" },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "0.01",
            },
          },
        ],
      });
    },
    onApprove(data, actions) {
      /**
       * data: {
       *   orderID: string;
       *   payerID: string;
       *   paymentID: string | null;
       *   billingToken: string | null;
       *   facilitatorAccesstoken: string;
       * }
       */
      return actions.order.capture({}).then((details) => {
        alert(
          "Transaction completed by" +
            (details?.payer.name.given_name ?? "No details")
        );

        alert("Data details: " + JSON.stringify(data, null, 2));
      });
    },
  };
  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">PayPal Integration Example</h1>
        <div className="mb-4">
      {isPending ? <h2>Load Smart Payment Button...</h2> : null}
      <PayPalButtons {...paypalbuttonTransactionProps} />
      </div>
    </div>
  );
}

// function Button() {
//   /**
//    * usePayPalScriptReducer use within PayPalScriptProvider
//    * isPending: not finished loading(default state)
//    * isResolved: successfully loaded
//    * isRejected: failed to load
//    */
//   const [{ isPending }] = usePayPalScriptReducer();
//   const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
//     style: { layout: "vertical" },
//     createOrder(data, actions) {
//       return actions.order.create({
//         purchase_units: [
//           {
//             amount: {
//               value: "0.01",
//             },
//           },
//         ],
//       });
//     },
//     onApprove(data, actions) {
//       /**
//        * data: {
//        *   orderID: string;
//        *   payerID: string;
//        *   paymentID: string | null;
//        *   billingToken: string | null;
//        *   facilitatorAccesstoken: string;
//        * }
//        */
//       return actions.order.capture({}).then((details) => {
//         alert(
//           "Transaction completed by" +
//             (details?.payer.name.given_name ?? "No details")
//         );

//         alert("Data details: " + JSON.stringify(data, null, 2));
//       });
//     },
//   };
//   return (
//     <>
//       {isPending ? <h2>Load Smart Payment Button...</h2> : null}
//       <PayPalButtons {...paypalbuttonTransactionProps} />
//     </>
//   );
// }


export default function PaypalComp() {
  return (
    <div className="mt-96">
      <h1>Hello PayPal</h1>
      <PayPalScriptProvider options={paypalScriptOptions}>
        <Button />
      </PayPalScriptProvider>
    </div>
  );
}
