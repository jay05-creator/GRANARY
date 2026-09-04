/**
 * Profile editing dialog — lets users update their name, phone,
 * farm/company, and location after registration. Includes account deletion.
 */
import { useState, useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { User, Phone, MapPin, Building2, Save, X, Trash2, AlertTriangle, Camera } from "lucide-react";
import { sanitizeName, sanitizePhone, sanitizeLocation } from "@/shared/sanitize";
import { useCurrentUser } from "@/shared/auth/use-current-user";

interface ProfileData {
  name: string;
  phone: string;
  village_or_company: string;
  farm_or_contact: string;
}

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileData;
  onSave: (updates: { name?: string; phone?: string; villageOrCompany?: string; farmOrContact?: string; photo?: string }) => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  onSave,
  onDeleteAccount,
}: ProfileEditDialogProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.village_or_company);
  const [detail, setDetail] = useState(profile.farm_or_contact);
  const currentUser = useCurrentUser();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(currentUser?.profileImageUrl || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0); // 0=hidden, 1=warn, 2=type confirmation
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Reset form when profile changes
  useEffect(() => {
    if (open) {
      setName(profile.name);
      setPhone(profile.phone);
      setLocation(profile.village_or_company);
      setDetail(profile.farm_or_contact);
      setPhotoDataUrl(currentUser?.profileImageUrl || null);
      setError("");
      setShowDeleteConfirm(false);
      setDeleteStep(0);
      setDeleteText("");
      setDeleteError("");
    }
  }, [open, profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        name: sanitizeName(name),
        phone: sanitizePhone(phone),
        villageOrCompany: sanitizeLocation(location),
        farmOrContact: sanitizeText(detail),
        photo: photoDataUrl || undefined,
      });
      onOpenChange(false);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteStep(1);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteStep(2);
    setDeleteText("");
    setDeleteError("");
  };

  const handleDeleteFinal = async () => {
    if (deleteText !== "DELETE") {
      setDeleteError("Type DELETE to confirm.");
      return;
    }
    if (!onDeleteAccount) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await onDeleteAccount();
    } catch {
      setDeleting(false);
      setDeleteError("Failed to delete account. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="size-5 text-emerald-600 dark:text-emerald-400" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="relative group">
              <div className="size-20 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center">
                {photoDataUrl ? (
                  <img src={photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="size-8 text-muted-foreground" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="size-5 mb-1" />
                <span className="text-[10px] font-medium">Upload</span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) {
                      setError("Image must be smaller than 2MB.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const MAX_WIDTH = 256;
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;
                        const ctx = canvas.getContext("2d");
                        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                        setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.8));
                        setError("");
                      };
                      img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">Click to update photo</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Phone Number</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Location / Village</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">Farm / Company</label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3.5 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving || deleting}>
            <X className="mr-1.5 size-3.5" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || deleting} className="bg-emerald-700 hover:bg-emerald-600 text-white">
            <Save className="mr-1.5 size-3.5" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* ——— Delete Account Section ——— */}
        {onDeleteAccount && (
          <div className="mt-4 border-t border-border pt-4">
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently remove your account and all data.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDeleteClick}
                  disabled={saving || deleting}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Delete
                </Button>
              </div>
            ) : deleteStep === 1 ? (
              /* Step 1: Warning */
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">This action cannot be undone</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-1.5 space-y-0.5 list-disc list-inside">
                      <li>Your profile and login credentials</li>
                      <li>All storage facilities (if operator)</li>
                      <li>All harvest lots and storage requests</li>
                      <li>All uploaded documents</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteStep(0); }}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    I understand, continue
                  </Button>
                </div>
              </div>
            ) : (
              /* Step 2: Type confirmation */
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">Type DELETE to confirm</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is your last chance. All data will be permanently erased.
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  value={deleteText}
                  onChange={(e) => { setDeleteText(e.target.value); setDeleteError(""); }}
                  placeholder='Type "DELETE" to confirm'
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && deleteText === "DELETE" && !deleting) {
                      handleDeleteFinal();
                    }
                  }}
                  className="w-full rounded-lg border border-destructive/40 bg-background px-3 py-2 text-sm font-mono focus:border-destructive focus:outline-none"
                />
                {deleteError && (
                  <p className="text-xs text-destructive">{deleteError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setDeleteStep(1); setDeleteText(""); setDeleteError(""); }}
                    disabled={deleting}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDeleteFinal}
                    disabled={deleting || deleteText !== "DELETE"}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    {deleting ? (
                      <span className="flex items-center gap-1.5">
                        <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <Trash2 className="mr-1.5 size-3.5" />
                        Permanently Delete Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Helper to sanitize text (local use). */
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}
