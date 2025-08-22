import { apiRequest } from "@lib/utils";
import { useAPI } from "@stores/apiStore";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import type { APIPostReportJSONBody } from "shared";

export function useDownloadReport() {
    const { user } = useAPI();
    const mutation = useMutation({
        async mutationFn(data: APIPostReportJSONBody) {
            const result = await apiRequest("/report", "POST", data, localStorage.getItem("token"));
            if (result.status !== 200) {
                return undefined;
            }

            const blob = new Blob([await result.arrayBuffer()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${moment().format("DD.MM.YYYY")}_${user?.firstName}-${user?.lastName}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            console.log(result);
        },
    });

    return mutation;
}
