import { useNavigate } from "react-router-dom";
import tags from './Tags'
import NotLoggedIn from "./NotLoggedIn";

export default function ExploreTags() {

	const navigate = useNavigate();

	const userId = localStorage.getItem('userId')

	if(!userId){
		return(
			<NotLoggedIn />
		)
	}

	return (
		<div className="p-6 section h-full overflow-scroll">
		<div className="flex justify-center my-4">
			<h2 className="text-3xl font-semibold mb-6 relative underline-orange">
				Explore by Interests
			</h2>
		</div>

		<div className="grid gap-6">
			{Object.entries(tags).map(([category, tagList]) => (
			<div key={category} className="mb-5">
				<div className="flex justify-center mb-3">
					<h2 className="text-2xl font-semibold mb-6 relative underline-orange">
						{category}
					</h2>
				</div>

				<div className="grid grid-cols-5 gap-4">
				{tagList.map((tag) => (
					<div
						key={tag}
						className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-[1.05] transition"
						style={{ aspectRatio: '4 / 3' }}
						onClick={() => navigate(`/nquery/tag/${tag}`)}
					>
						<img
							src={`/images/${tag}.jpeg`}
							alt={tag}
							className="object-cover w-full h-full brightness-50 transition"
						/>
						<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
							<h4 className="text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
							{tag}
							</h4>
						</div>
					</div>
				))}
				</div>
			</div>
			))}
		</div>
		</div>
	);
	}
