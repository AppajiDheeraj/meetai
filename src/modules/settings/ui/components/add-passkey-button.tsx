// "use client";

// import { authClient } from "@/lib/auth-client";

// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export const AddPasskeyButton = () => {
//     const handleAddPasskey = async () => {
//         const { data, error } = await authClient.passkey.addPasskey();

//         if (error) {
//             toast.error("Failed to add passkey.");
//         } else {
//             toast.success("Passkey added successfully.");
//         }
//     };

//     return (
//         <Button onClick={handleAddPasskey}>
//             Add Passkey
//         </Button>
//     );
// };
