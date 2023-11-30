import {
  AppShell,
  Text,
  FileInput,
  Title,
  Select,
  Button,
  Container,
  Card,
  Image,
  Group,
  ActionIcon,
  Center,
} from "@mantine/core";
import classes from "./App.module.css";
import { useScrollIntoView } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { notifications } from "@mantine/notifications";
import { IconBrandGithub } from "@tabler/icons-react";

function App() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const [generatedText, setGeneratedText] = React.useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);

  const form = useForm({
    initialValues: {
      image: null,
      social_media: "twitter",
    },
    validate: {
      image: (value) => (!value ? "Image is required" : null),
    },
  });

  const generateRequest = async (values: any) => {
    const image_base64 = await toBase64(values.image);
    setUploadedImage(image_base64);
    const data = {
      image_base64: image_base64,
      social_media: values.social_media,
    };

    const baseURL = import.meta.env.VITE_API_URL || "/api/v1";
    const response = await axios.post(`${baseURL}/generate`, data);

    return response.data;
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const { mutate: generate, isPending } = useMutation({
    mutationFn: generateRequest,
    onSuccess: (data) => {
      setGeneratedText(data.generated);
      scrollIntoView();
    },
  });

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className={classes.header}>
          <Group justify="space-between">
            <Text size="xl" fw={700}>
              {"Caption 🌋"}
            </Text>

            <ActionIcon
              variant="transparent"
              color="gray"
              mx="md"
              aria-label="Github"
              component="a"
              href="https://github.com/n4ze3m/caption"
              target="_blank"
            >
              <IconBrandGithub size={24} />
            </ActionIcon>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <div className={classes.main}>
          <Title
            order={2}
            size="h2"
            style={{ marginBottom: 40, textAlign: "center" }}
            ta="center"
          >
            Generate Social Media post from an image using LLaVA AI. 🌋
          </Title>
          <form
            onSubmit={form.onSubmit((v) => {
              generate(v);
            })}
            className={classes.form}
          >
            <FileInput
              mb="md"
              label="Upload Image"
              placeholder="Upload image"
              accept="image/jpeg, image/png, image/ppm, image/gif, image/tiff, image/bmp"
              required
              {...form.getInputProps("image")}
            />

            <Select
              mb="md"
              data={[
                { value: "twitter", label: "Twitter" },
                { value: "facebook", label: "Facebook" },
                { value: "instagram", label: "Instagram" },
                { value: "linkedin", label: "LinkedIn" },
              ]}
              label="Select Platform"
              placeholder="Select Platform"
              required
              {...form.getInputProps("social_media")}
            />

            <Button loading={isPending} type="submit" fullWidth color="teal">
              Generate
            </Button>
          </form>

          <div ref={targetRef}>
            {generatedText && !isPending && (
              <Container py="xl">
                <Card
                  onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    notifications.show({
                      title: "Copied to clipboard",
                      message: "The caption has been copied to your clipboard.",
                      color: "teal",
                      autoClose: 5000,
                    });
                  }}
                  className={classes.card}
                  withBorder
                  radius="md"
                  p={0}
                >
                  <div className={classes.body}>
                    <Image
                      src={uploadedImage}
                      height={200}
                      alt="Uploaded Image"
                    />
                    <Text m="md" fz="lg" c="dimmed">
                      {generatedText}
                    </Text>
                  </div>
                </Card>
              </Container>
            )}
          </div>
        </div>
      </AppShell.Main>
      <AppShell.Footer withBorder={false} my="md">
        <Center>
          <Text size="xs" c="dimmed">
            {"n4ze3m | pls don't bankrupt me"}
          </Text>
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
