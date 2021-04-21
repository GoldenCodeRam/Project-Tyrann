<script>
	import ServerCard from "./ServerCard.svelte";
  </script>
  
  <main>
	<div class="flex flex-col items-center justify-center text-center mt-10">
	  <h1 class="text-4xl">
		Hi! I'm the Coordinator Server for the Bully Algorithm 👨‍⚖
	  </h1>
	  <h1 class="text-4xl">The current leader is 🦸‍♂️:</h1>
  
	  <ServerCard
		serverNum={"Leader"}
		serverIP={"X.X.X.X"}
		serverPort={"PORT"}
		colorSVG={"bg-yellow-500"}
	  />
	</div>
  
	<hr />
  
	<div class="flex items-center justify-center mt-10">
	  <div
		class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
	  />
  
	  <ServerCard
		serverNum={1}
		serverIP={"X.X.X.X"}
		serverPort={"PORT"}
		colorSVG={"bg-green-500"}
	  />
	</div>
  </main>
  
  <style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
  </style>
  