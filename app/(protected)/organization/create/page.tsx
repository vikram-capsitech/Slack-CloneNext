"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Typography from "@/components/ui/typegraphy";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";
import ImageDropZone from "@/components/image-upload";

const OrganizationSetup = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user: any = useCurrentUser();

  const { currStep } = useCreateWorkspaceValues();

  let stepInView = null;

  switch (currStep) {
    case 1:
      stepInView = <Step1 />;
      break;
    case 2:
      stepInView = <Step2 />;
      break;
    default:
      stepInView = <Step1 />;
  }

  return (
    <div>
      {/* <InitialModal /> */}
      <div className="w-screen h-screen grid place-content-center bg-neutral-800 text-white">
        <div className="p-3 max-w-[550px]">
          <Typography
            text={`step ${currStep} of 2`}
            variant="p"
            className="text-neutral-400"
          />

          {stepInView}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;

const Step1 = () => {
  const { name, updateValues, setCurrStep } = useCreateWorkspaceValues();

  return (
    <>
      <Typography
        text="What is the name of your company or team"
        className="my-4"
      />

      <Typography
        text="This will be the name of your Scraawl workspace - choose something that your team will recognize."
        className="text-neutral-300"
        variant="p"
      />

      <form className="mt-6">
        <fieldset>
          <Input
            className="bg-neutral-700 text-white border-neutral-600"
            type="text"
            value={name}
            placeholder="Enter your company name"
            onChange={(event) => updateValues({ name: event.target.value })}
          />
          <Button
            type="button"
            className="mt-10 float-right"
            onClick={() => setCurrStep(2)}
            disabled={!name}
          >
            <Typography text="Next" variant="p" />
          </Button>
        </fieldset>
      </form>
    </>
  );
};

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.any().optional(),
});

const Step2 = () => {
  const { setCurrStep, updateImageUrl, imageUrl, name } =
    useCreateWorkspaceValues();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    debugger;
    setError(undefined);
    setSuccess(undefined);
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.imageUrl) {
        formData.append("imageFile", values.imageUrl);
      }

      axios
        .post("/api/organization/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response: any) => {
          if (response.status === 500) {
            setError(response.data.message);
          } else if (response.status === 200) {
            setSuccess(response.data.message);
            router.push(`/organization/${response.data.value.id}`);
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <>
      <Button
        size="sm"
        className="text-white"
        variant="link"
        onClick={() => setCurrStep(1)}
      >
        <Typography text="Back" variant="p" />
      </Button>

      <form>
        <Typography text="Add workspace avatar" className="my-4" />
        <Typography
          text="This image can be changed later in your workspace settings."
          className="text-neutral-300"
          variant="p"
        />

        <fieldset
          disabled={isPending}
          className="mt-6 flex flex-col items-center space-y-9"
        >
          <ImageDropZone
            onUpload={(file) => {
              setImageFile(file);
              updateImageUrl(file);
            }}
          />
          <div className="space-x-5">
            <Button
              onClick={() => {
                setImageFile(null);
                onSubmit({ name });
              }}
            >
              <Typography text="Skip for now" variant="p" />
            </Button>

            {imageFile ? (
              <Button
                type="button"
                onClick={() => onSubmit({ name, imageUrl })}
                size="sm"
                variant="destructive"
              >
                <Typography text="Submit" variant="p" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="text-white bg-gray-500"
              >
                <Typography text="Select an Image" variant="p" />
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};
