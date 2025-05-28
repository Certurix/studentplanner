import { useDropzone } from "react-dropzone";
import {
	Tabs,
	TabItem,
	Card,
	Button,
	Label,
	TextInput,
} from "flowbite-react";
import { Icon } from "@iconify-icon/react";

// This component uses flowbite-react Tabs and TabItem for accessible tab navigation.
export default function UserSettings({ data }) {
	const baseUrl = import.meta.env.VITE_API_URL || "";

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"],
		},
		onDrop: (acceptedFiles) => {
			const file = acceptedFiles[0];
			const reader = new FileReader();
			reader.onload = () => {
				data.avatar = reader.result;
			};
			reader.readAsDataURL(file);
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = e.target;
		const formData = {
			name: form.elements["name"].value,
			lastname: form.elements["lastname"].value,
			email: form.elements["email"].value,
			school: form.elements["school"].value,
			class: form.elements["class"].value,
			avatar: data.avatar,
		};

		try {
			// Send individual requests to update user data
			const updateFields = [
				"name",
				"lastname",
				"email",
				"school",
				"classname",
				"avatar",
			];
			for (const field of updateFields) {
				if (formData[field]) {
					const response = await fetch(
						`${baseUrl}/api/users/${data.userId}/${field}`,
						{
							method: "POST",
							body: JSON.stringify({
								[field]: formData[field],
							}),
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (!response.ok) {
						throw new Error(`Failed to update ${field}`);
					}
				}
			}

			// Update avatar if it exists
			if (formData.avatar) {
				const response = await fetch(
					`${baseUrl}/api/users/${data.userId}/avatar`,
					{
						method: "POST",
						body: JSON.stringify({ avatar: formData.avatar }),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to update avatar");
				}
			}

			window.location.reload();
		} catch (error) {
			console.error("Error saving settings:", error);
			return;
		}
	};

	return (
		<main className="container mx-auto mt-4">
			<Tabs aria-label="Paramètres utilisateur" defaultIndex={0}>
				<TabItem title="Mes infos">
					<Card className="p-4 shadow-sm">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
								<div>
									<Label htmlFor="name" value="Nom" />
									<TextInput
										id="name"
										name="name"
										defaultValue={data.name}
										className="rounded"
										required
									/>
								</div>
								<div>
									<Label htmlFor="lastname" value="Prénom" />
									<TextInput
										id="lastname"
										name="lastname"
										defaultValue={data.lastname}
										className="rounded"
										required
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="email" value="Email" />
								<TextInput
									id="email"
									type="email"
									name="email"
									defaultValue={data.email}
									className="rounded"
									required
								/>
							</div>
							<div>
								<Label htmlFor="avatar" value="Votre photo" />
								<div className="flex items-center gap-4 mt-2">
									<img
										src={data.avatar}
										alt="avatar utilisateur"
										className="rounded-full"
										width="50"
										height="50"
									/>
									<div
										{...getRootProps()}
										className="border-2 border-dashed p-3 rounded text-center w-1/2 cursor-pointer"
										tabIndex={0}
										role="button"
										aria-label="Uploader une photo"
									>
										<input {...getInputProps()} />
										<Icon
											icon="tabler:upload"
											className="text-secondary mx-auto"
											width="24"
											height="24"
										/>
										<p className="text-primary text-sm">
											Cliquez pour envoyer ou glissez-déposez
										</p>
										<p className="text-gray-500 text-xs">
											SVG, PNG, JPG ou GIF (max. 800×400px)
										</p>
									</div>
								</div>
							</div>
							<div>
								<Label htmlFor="school" value="École" />
								<TextInput
									id="school"
									name="school"
									defaultValue={data.school}
									className="rounded"
								/>
							</div>
							<div>
								<Label htmlFor="class" value="Classe" />
								<TextInput
									id="class"
									name="class"
									defaultValue={data.class}
									className="rounded"
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button color="red" type="button">
									Annuler
								</Button>
								<Button color="blue" type="submit">
									Sauvegarder
								</Button>
							</div>
						</form>
					</Card>
				</TabItem>
				<TabItem title="Sécurité">
					<Card className="p-4 shadow-sm">
						<h3 className="text-lg font-medium mb-2">Sécurité</h3>
						<p className="text-sm text-gray-500 mb-4">
							Mettez à jour vos paramètres de sécurité.
						</p>
						{/* Add security settings form here */}
					</Card>
				</TabItem>
			</Tabs>
		</main>
	);
}
