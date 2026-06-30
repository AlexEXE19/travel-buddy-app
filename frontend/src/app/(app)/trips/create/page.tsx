import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"
import { CreateTripForm } from "@/src/features/trips/components/create-trip-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

export default function CreateTripPage() {
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mx-auto max-w-5xl">
				<Link
					href="/trips"
					className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to trips
				</Link>

				<Card className="overflow-hidden">
					<CardHeader className="border-b bg-muted/20">
						<div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Compass className="h-5 w-5" />
						</div>
						<CardTitle className="text-2xl">Create a trip</CardTitle>
						<CardDescription>
							Set the title, dates, capacity and route. Every location can be resolved from your location
							provider and stored with coordinates.
						</CardDescription>
					</CardHeader>

					<CreateTripForm />
				</Card>
			</div>
		</div>
	)
}
