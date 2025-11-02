import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();
export function showToast(
    title,
    message,
    status,
    {
        duration = 9000,
        isClosable = true,
        position = "bottom-right",
        ...rest
    } = {}
) {
    toast({
        title,
        description: message,
        status,
        duration,
        isClosable,
        position,
        ...rest,
    });
}
