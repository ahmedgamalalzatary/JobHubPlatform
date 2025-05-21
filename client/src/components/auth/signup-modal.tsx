import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupForm } from "./signup-form";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("createAccount")}</DialogTitle>
          <DialogDescription>
            {t("fillDetails")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <SignupForm onSignupSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
