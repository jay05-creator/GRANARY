import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import { ShieldCheck, UploadCloud, Loader2, FileCheck, AlertTriangle } from "lucide-react";
import { verifyOwnerDocument } from "@/server/modules/verification";

export interface DocVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocVerificationModal({ open, onOpenChange }: DocVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        
        try {
          const res = await verifyOwnerDocument({
            data: {
              base64Image: base64Data,
              mimeType: file.type
            }
          });

          if (res.success) {
            setResult(res);
          } else {
            setError(res.error || "Verification failed");
          }
        } catch (err: any) {
          setError(err.message || "Failed to call verification API");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error reading file");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-3xl border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-medium">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </span>
            Verify KYC Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload your Land Record, PAN, or Aadhaar card. Our Gemini AI will analyze and verify the document authenticity.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="size-10 text-muted-foreground mb-3" />
              <p className="font-medium text-sm">Click to upload document</p>
              <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG (Max 5MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center h-48">
                <img src={previewUrl} alt="Document preview" className="max-h-full max-w-full object-contain" />
              </div>

              {loading ? (
                <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center gap-3 border border-border">
                  <Loader2 className="size-5 animate-spin text-emerald-600" />
                  <span className="text-sm font-medium">Gemini AI is analyzing document...</span>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 rounded-xl p-4 text-destructive border border-destructive/20 text-sm flex items-start gap-2">
                  <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : result ? (
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    {result.isValidDocument ? (
                      <FileCheck className="size-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="size-5 text-orange-500" />
                    )}
                    <span className="font-semibold text-sm">
                      {result.isValidDocument ? "Document Verified" : "Verification Failed"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">Type</span>
                      <span className="font-medium">{result.documentType}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">Name</span>
                      <span className="font-medium">{result.extractedName || "Not found"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground block mb-0.5">ID / Registration Number</span>
                      <span className="font-medium font-mono">{result.extractedIdNumber || "Not found"}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg text-xs mt-2 border border-border">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">AI Reasoning:</span>
                    {result.reasoning}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => {
                  setPreviewUrl(null);
                  setResult(null);
                  setError(null);
                }}>
                  Upload Different File
                </Button>
                <Button onClick={handleClose} className="bg-emerald-700 text-white hover:bg-emerald-600">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
