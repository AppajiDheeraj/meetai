"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { authClient } from "@/lib/auth-client"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { PricingCard } from "../components/pricing-card"

export const UpgradeView = () => {
    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(
        trpc.premium.getProducts.queryOptions()
    );
    const { data: currentSubscription } = useSuspenseQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    );
  return (
    <div className="flex-1 align-content py-4 px-4 md:px-8 flex flex-col gap-y-10">
        <div className="mt-4 flex-1 flex-col gap-y-10 items-center flex">
            <h5 className="font-medium text-2xl md:text-3xl">
                You are on the{" "}
                <span className="font-semibold text-primary">
                    {currentSubscription?.name ?? "Free"}
                </span>{" "}
                plan.
            </h5>
            <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => {
                    const isCurrentProduct = currentSubscription?.id === product.id;
                    const isPremium = !!currentSubscription;

                    let buttonText = "Upgrade";
                    let onClick = () => authClient.checkout({
                        products: [product.id]
                    })
                    if (isCurrentProduct) {
                        buttonText = "Manage";
                        onClick = () => authClient.customer.portal();;
                    } else if (isPremium) {
                        buttonText = "Change Plan";
                        onClick = () => authClient.customer.portal();
                    }

                    return (
                        <PricingCard
                            key={product.id}
                            variant={
                                product.metadata.variant === "highlighted"
                                    ? "highlighted"
                                    : "default"
                            }
                            title={product.name}
                            price={
                                product.prices[0].amountType === "fixed"
                                    ? product.prices[0].priceAmount / 100
                                    : 0
                            }
                            description={product.description}
                            priceSuffix={`/${product.prices[0].recurringInterval}`}
                            features={ product.benefits.map((benefit) =>
                                benefit.description
                            )}
                            badge={product.metadata.badge as string | null}
                            buttonText={buttonText}
                            onClick={onClick}
                        />
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export const UpgradeViewLoading = () => {
    return (
        <LoadingState title="Loading" description="This may take a few seconds"/>
    )
}

export const UpgradeViewError = () => {
    return (
        <ErrorState title="Error" description="Plaese try again later"/>
    )
}