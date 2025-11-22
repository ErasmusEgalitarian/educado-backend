import { useState } from "react";
import { toast } from "sonner";

import { UploadFile } from "@/shared/api/types.gen";
import { Button } from "@/shared/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/shared/components/shadcn/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/shadcn/tabs";

import MediaDisplayEditor from "./media-display-editor";
import { MediaInput } from "./media-input";

interface MediaPickerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: UploadFile) => void;
}

const MediaPickerModal = ({
  isOpen,
  onOpenChange,
  onSelect,
}: MediaPickerModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState<UploadFile | null>(null);

  const handleUploadComplete = (files: UploadFile[]) => {
    if (files.length > 0) {
      onSelect(files[0]);
      onOpenChange(false);
      toast.success("Arquivo enviado com sucesso!");
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw]! h-[85vh]! max-w-none! p-6 flex flex-col overflow-hidden">
        <Tabs
          defaultValue="enviar"
          className="w-full h-full flex flex-col min-h-0"
        >
          <TabsList className="shrink-0 w-full grid grid-cols-2 bg-transparent p-0 rounded-none">
            <TabsTrigger
              value="enviar"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-0 border-b-3 border-greyscale-border-lighter data-[state=active]:border-primary-surface-default data-[state=active]:text-primary-surface-default text-greyscale-text-subtle hover:text-greyscale-text-body h-12 px-4"
            >
              Enviar arquivo
            </TabsTrigger>
            <TabsTrigger
              value="banco"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-0 border-b-3 border-greyscale-border-lighter data-[state=active]:border-primary-surface-default data-[state=active]:text-primary-surface-default text-greyscale-text-subtle hover:text-greyscale-text-body h-12 px-4"
            >
              Banco de imagens
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="enviar"
            className="flex-1 overflow-auto mt-4 min-h-0"
          >
            <div className="p-6 h-full flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl">
                <MediaInput
                  variant="upload"
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="banco"
            className="flex-1 overflow-hidden mt-4 min-h-0"
          >
            <div className="h-full w-full overflow-hidden">
              <MediaDisplayEditor
                defaultMode="select"
                onSelectionChange={setSelectedAsset}
              />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between items-center mt-4 pt-4 border-t shrink-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              Cancelar
            </Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button disabled={!selectedAsset} onClick={handleConfirmSelection}>
              Selecionar Imagem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPickerModal;
