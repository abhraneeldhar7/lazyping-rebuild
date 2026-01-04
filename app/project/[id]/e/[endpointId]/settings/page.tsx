import { getEndpointDetails } from "@/app/actions/endpointActions";
import EndpointSettingsClientPage from "@/components/endpointSettingsPage";

export default async function EndpointSettings({ params }: { params: Promise<{ endpointId: string }> }) {
    const { endpointId } = await params
    const endpointDetails = await getEndpointDetails(endpointId)
    return (
        <EndpointSettingsClientPage endpointDetails={JSON.parse(JSON.stringify(endpointDetails))} />
    )
}