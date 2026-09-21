import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../lib/api/types";
import { reportsApi } from "../api";

const useUploadReportPhotosMutation = (reportId: string) => {
  const qc = useQueryClient();

  return useMutation<unknown, ApiError, File[]>({
    mutationFn: (files) => reportsApi.uploadPhotos(reportId, files),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports", "detail", reportId] });
      // If later you add GET photos endpoint, invalidate it here too.
    },
  });
};

export default useUploadReportPhotosMutation;