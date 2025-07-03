"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const ARPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      {/* Button to trigger popup */}
      <Button onClick={() => setOpen(true)} className="bg-primary my-6 px-6 *:text-white hover:bg-primary/90 transition-colors">
        Launch Dev's AR Business Card 🚀
      </Button>

      {/* AR Popup using your ResponsiveDialog */}
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Wanna connect with me in AR? 🚀"
        description="Scan the QR code below to experience my AR Business Card!"
      >
        <div className="flex flex-col items-center gap-4">
          <img
            src="/qrcode.png"
            alt="Scan QR to connect in AR"
            className="w-40 h-40 border rounded-lg shadow-lg"
          />
        </div>
      </ResponsiveDialog>
    </div>
  );
};
