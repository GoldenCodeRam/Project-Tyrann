<script>
    export let serverNum;
    export let serverIP;
    export let serverPort;
    export let colorSVG;
    
  </script>
  
  <div
    class="relative mt-7 bg-gray-100 py-6 px-6 rounded-3xl w-64 my-4 shadow-xl"
  >
    <div
      class=" text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl {colorSVG} left-4 -top-6"
    >
      <!-- svg  -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
    <div class="mt-8">
      <p class="text-3xl font-semibold my-2">Server {serverNum} 🦸‍♂️</p>
      <div class="flex space-x-2 text-gray-600 text-sm">
        <p>Server IP: {serverIP}</p>
      </div>
      <div class="flex space-x-2 text-gray-600 text-sm my-3">
        <p>Running on port: {serverPort}</p>
      </div>
    </div>
  </div>
  
  <style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  </style>
  