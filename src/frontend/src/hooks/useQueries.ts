import { useBackend } from "@/hooks/useBackend";
import type {
  CreateFormInput,
  Form,
  FormResponse,
  FormSummary,
  SubmitResponseInput,
  UpdateFormInput,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── List user's forms ────────────────────────────────────────────────────────
export function useListForms() {
  const { backend } = useBackend();
  return useQuery<FormSummary[]>({
    queryKey: ["forms"],
    queryFn: async () => {
      if (!backend) return [];
      const result = await (
        backend as unknown as { listForms: () => Promise<FormSummary[]> }
      ).listForms();
      return result;
    },
    enabled: !!backend,
  });
}

// ── Get single form ──────────────────────────────────────────────────────────
export function useGetForm(formId: string) {
  const { backend } = useBackend();
  return useQuery<Form | null>({
    queryKey: ["form", formId],
    queryFn: async () => {
      if (!backend) return null;
      const result = await (
        backend as unknown as { getForm: (id: string) => Promise<Form | null> }
      ).getForm(formId);
      return result;
    },
    enabled: !!backend && !!formId,
  });
}

// ── Get published form (public) ──────────────────────────────────────────────
export function useGetPublishedForm(formId: string) {
  const { backend } = useBackend();
  return useQuery<Form | null>({
    queryKey: ["published-form", formId],
    queryFn: async () => {
      if (!backend) return null;
      const result = await (
        backend as unknown as {
          getPublishedForm: (id: string) => Promise<Form | null>;
        }
      ).getPublishedForm(formId);
      return result;
    },
    enabled: !!formId,
  });
}

// ── Create form ──────────────────────────────────────────────────────────────
export function useCreateForm() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Form, Error, CreateFormInput>({
    mutationFn: async (input) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          createForm: (input: CreateFormInput) => Promise<Form>;
        }
      ).createForm(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── Update form ──────────────────────────────────────────────────────────────
export function useUpdateForm(formId: string) {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Form | null, Error, UpdateFormInput>({
    mutationFn: async (input) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          updateForm: (
            id: string,
            input: UpdateFormInput,
          ) => Promise<Form | null>;
        }
      ).updateForm(formId, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
      void queryClient.invalidateQueries({ queryKey: ["form", formId] });
    },
  });
}

// ── Publish form ─────────────────────────────────────────────────────────────
export function usePublishForm() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Form | null, Error, string>({
    mutationFn: async (formId) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          publishForm: (id: string) => Promise<Form | null>;
        }
      ).publishForm(formId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── Unpublish form ───────────────────────────────────────────────────────────
export function useUnpublishForm() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Form | null, Error, string>({
    mutationFn: async (formId) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          unpublishForm: (id: string) => Promise<Form | null>;
        }
      ).unpublishForm(formId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── Delete form ──────────────────────────────────────────────────────────────
export function useDeleteForm() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (formId) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as { deleteForm: (id: string) => Promise<boolean> }
      ).deleteForm(formId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── Duplicate form ───────────────────────────────────────────────────────────
export function useDuplicateForm() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<Form | null, Error, string>({
    mutationFn: async (formId) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          duplicateForm: (id: string) => Promise<Form | null>;
        }
      ).duplicateForm(formId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── Submit response ──────────────────────────────────────────────────────────
export function useSubmitResponse() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<FormResponse, Error, SubmitResponseInput>({
    mutationFn: async (input) => {
      if (!backend) throw new Error("Not authenticated");
      return (
        backend as unknown as {
          submitResponse: (input: SubmitResponseInput) => Promise<FormResponse>;
        }
      ).submitResponse(input);
    },
    onSuccess: (_, { formId }) => {
      void queryClient.invalidateQueries({ queryKey: ["responses", formId] });
      void queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

// ── List responses ───────────────────────────────────────────────────────────
export function useListResponses(formId: string) {
  const { backend } = useBackend();
  return useQuery<FormResponse[]>({
    queryKey: ["responses", formId],
    queryFn: async () => {
      if (!backend) return [];
      return (
        backend as unknown as {
          getResponses: (id: string) => Promise<FormResponse[]>;
        }
      ).getResponses(formId);
    },
    enabled: !!backend && !!formId,
  });
}

// ── Export responses CSV ─────────────────────────────────────────────────────
export function useExportResponsesCsv(formId: string) {
  const { backend } = useBackend();
  return useQuery<string>({
    queryKey: ["responses-csv", formId],
    queryFn: async () => {
      if (!backend) return "";
      return (
        backend as unknown as {
          exportResponsesCsv: (id: string) => Promise<string>;
        }
      ).exportResponsesCsv(formId);
    },
    enabled: false, // manual trigger only
  });
}
