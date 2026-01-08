"use client"
import { EndpointType } from "@/lib/types";
import { Switch } from "../ui/switch";
import { toggleEndpoint } from "@/app/actions/endpointActions";
import { useState } from "react";
import { toast } from "sonner";

export default function EndpointEnableToggle({ endpointDetails }: { endpointDetails: EndpointType }) {
    // const [loading, setLoading] = useState(false)

    return (
        <Switch defaultChecked={endpointDetails.enabled} onClick={() => {
            toggleEndpoint(endpointDetails)
            toast.info("Endpoint toggled")
        }} />

    )
}