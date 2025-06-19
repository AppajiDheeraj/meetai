import Image from "next/image";

interface Props {
    title: string;
    description: string;
};

export const EmptyState = ({ title, description }: Props) => {
    return (
        <div className="flex items-center justify-center flex-col">
            <Image src={"./empty.svg"} alt="Empty State" width={250} height={250} />
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
                <h6 className="text-lg font-medium">{title}</h6>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}