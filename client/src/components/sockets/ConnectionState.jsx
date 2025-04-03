import React from "react";

export default function ConnectionState({ isConnected }) {
   if (isConnected) {
      return <p>✅ Connected.</p>;
   } else {
      return <p>❌ Disconnected.</p>;
   }
}
