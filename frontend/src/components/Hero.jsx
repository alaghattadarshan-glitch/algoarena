import React from 'react';
import { motion } from 'framer-motion';
import AlgorithmWikiModal from './AlgorithmWikiModal';
import { Cpu, Globe2, Lightbulb } from 'lucide-react';

const Hero = () => {
  const sortingWikiData = [
    {
      id: 'bubble',
      name: 'Bubble Sort',
      imagePath: '/algoarena/img/bubble_sort_flow.png',
      imageAlt: 'Bubble Sort Flowchart',
      colorGradient: 'from-[#00f3ff] to-purple-500',
      borderColor: 'border-[#00f3ff]/30',
      imageExplanation: "This flowchart demonstrates the 'bubbling' effect. You can see adjacent pairs being compared in the glowing boxes. If the left element is larger than the right, a swap occurs. Over multiple passes, the largest elements 'bubble' to the far right, which is marked as the 'Sorted Region'.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Bubble sort is a simple comparison-based algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N²) worst/average case. O(N) best case (if already sorted).</li>
            <li><strong>Space:</strong> O(1) auxiliary space.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Because of its inefficiency, Bubble Sort is rarely used in real-world software. However, it is an excellent educational tool for introducing the concept of sorting algorithms and optimization (like the early-exit optimization if no swaps occur).</p>
        </>
      )
    },
    {
      id: 'selection',
      name: 'Selection Sort',
      imagePath: '/algoarena/img/selection_sort_flow.png',
      imageAlt: 'Selection Sort Flowchart',
      colorGradient: 'from-green-400 to-cyan-500',
      borderColor: 'border-green-400/30',
      imageExplanation: "This diagram shows a 'minimum scanner' sweeping across the unsorted portion of the array. Once the absolute minimum value is found, it is immediately swapped with the first unsorted element, expanding the green 'Sorted Prefix' boundary on the left.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items. It proceeds by finding the smallest element in the unsorted sublist, exchanging it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N²) in all cases (best, average, worst).</li>
            <li><strong>Space:</strong> O(1) auxiliary space.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Selection sort makes exactly O(N) swaps, which is the theoretical minimum. Therefore, it is useful in scenarios where the cost of swapping items is extremely high (e.g., swapping massive chunks of data on flash memory where write operations degrade hardware).</p>
        </>
      )
    },
    {
      id: 'insertion',
      name: 'Insertion Sort',
      imagePath: '/algoarena/img/insertion_sort_flow.png',
      imageAlt: 'Insertion Sort Flowchart',
      colorGradient: 'from-orange-400 to-pink-500',
      borderColor: 'border-orange-400/30',
      imageExplanation: "In this flowchart, an element is pulled out of the unsorted section and held in a temporary variable. The already-sorted elements to its left are shifted to the right one-by-one to make a 'hole', and the temporary element is inserted into its perfect sorted position.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Insertion sort builds the final sorted array one item at a time. It iterates, consuming one input element each repetition, and grows a sorted output list. At each iteration, it removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N²) worst/average case. O(N) best case (if already sorted).</li>
            <li><strong>Space:</strong> O(1) auxiliary space.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Insertion sort is highly efficient for very small datasets or arrays that are already mostly sorted. In real-world standard libraries (like Python's Timsort or C++'s std::sort), the engine will automatically switch to Insertion Sort when the sub-arrays become very small (usually under 16 elements) because it has practically zero overhead.</p>
        </>
      )
    },
    {
      id: 'quick',
      name: 'Quick Sort',
      imagePath: '/algoarena/img/quick_sort_flow.png',
      imageAlt: 'Quick Sort Flowchart',
      colorGradient: 'from-red-500 to-cyan-400',
      borderColor: 'border-red-500/30',
      imageExplanation: "This highly technical tree diagram demonstrates the recursive nature of Quick Sort. A central 'Pivot' is selected. All elements smaller than the pivot are partitioned to the left branch, and larger elements to the right branch. The process repeats recursively until single elements remain.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Quicksort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N log N) average/best case. O(N²) worst case (if poor pivot chosen).</li>
            <li><strong>Space:</strong> O(log N) due to recursive call stack.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Quicksort is extremely fast in practice due to its excellent cache locality (array elements are accessed sequentially). It is the default sorting algorithm used in many system libraries, embedded systems, and databases where average-case speed is critical.</p>
        </>
      )
    },
    {
      id: 'merge',
      name: 'Merge Sort',
      imagePath: '/algoarena/img/merge_sort_flow.png',
      imageAlt: 'Merge Sort Flowchart',
      colorGradient: 'from-blue-500 to-purple-500',
      borderColor: 'border-blue-500/30',
      imageExplanation: "This diagram perfectly captures the 'Divide and Conquer' paradigm. The top half shows the array being repeatedly sliced in half down to individual elements. The bottom half shows these tiny arrays being zipped (merged) back together, enforcing sorted order as they recombine into the final array.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Merge Sort works by recursively dividing the unsorted list into n sublists, each containing one element (a list of one element is considered sorted). Then, it repeatedly merges sublists to produce new sorted sublists until there is only one sorted list remaining.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N log N) in all cases. It guarantees fast performance regardless of input.</li>
            <li><strong>Space:</strong> O(N) because it requires an entire secondary array to hold the merged data.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Merge sort is stable and guarantees O(N log N) time, making it ideal for sorting linked lists where memory allocation isn't an issue. It forms the backbone of highly advanced algorithms like Timsort (used in Python and Java's object sort).</p>
        </>
      )
    },
    {
      id: 'heap',
      name: 'Heap Sort',
      imagePath: '/algoarena/img/heap_sort_flow.png',
      imageAlt: 'Heap Sort Flowchart',
      colorGradient: 'from-yellow-400 to-orange-500',
      borderColor: 'border-yellow-400/30',
      imageExplanation: "This visual shows an array physically re-mapping itself into a glowing Binary Max-Heap tree. The largest element naturally floats to the root (top) of the tree. The algorithm then repeatedly pops the root off and throws it to the end of the array, rebuilding the tree each time.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. It maintains the unsorted region in a heap data structure to find the largest element in O(log N) time.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N log N) in all cases.</li>
            <li><strong>Space:</strong> O(1) auxiliary space! It sorts entirely in-place.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Because Heap Sort guarantees O(N log N) worst-case time while using exactly O(1) memory, it is heavily favored in embedded systems (like Mars rovers or medical devices) where memory limits are strictly constrained and system crashes due to memory overflow are fatal.</p>
        </>
      )
    },
    {
      id: 'radix',
      name: 'Radix Sort',
      imagePath: '/algoarena/img/radix_sort_flow.png',
      imageAlt: 'Radix Sort Flowchart',
      colorGradient: 'from-fuchsia-500 to-cyan-500',
      borderColor: 'border-fuchsia-500/30',
      imageExplanation: "This highly futuristic diagram illustrates non-comparative sorting. Multi-digit numbers are routed into 10 distinct physical 'buckets' (0-9). The data flows through the buckets based on their least-significant digit first, then re-routed for the next digit, until the entire array is perfectly sorted.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Radix sort avoids comparing elements directly. Instead, it groups numbers by their individual digits, processing them digit by digit from least significant to most significant (or vice-versa). It uses a stable sub-sort (like Counting Sort) to sort the elements by the current digit.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(d * (N + k)) where d is the number of digits and k is the base. This can technically beat O(N log N) for certain datasets!</li>
            <li><strong>Space:</strong> O(N + k) to hold the counting arrays and output.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Radix Sort is incredibly fast when sorting strings of uniform length or massive arrays of integers (like 64-bit integer keys in high-performance databases or routing tables) because it completely bypasses the mathematical O(N log N) limit of comparative sorts.</p>
        </>
      )
    },
    {
      id: 'bogo',
      name: 'Bogo Sort',
      imagePath: '/algoarena/img/bogo_sort_flow.png',
      imageAlt: 'Bogo Sort Flowchart',
      colorGradient: 'from-red-600 to-red-400',
      borderColor: 'border-red-600/30',
      imageExplanation: "This glitchy, chaotic diagram perfectly visualizes the absurdity of Bogo Sort. It shuffles the array into a completely random permutation, runs a 'Check if Sorted?' gate, and almost always hits the massive red 'NO' loop, repeating infinitely until pure luck solves the problem.",
      detailedInfo: (
        <>
          <h4 className="text-xl font-bold text-white mb-2">How It Works</h4>
          <p className="mb-4">Bogo Sort (also known as permutation sort, stupid sort, or monkey sort) is a highly ineffective sorting function based on the generate and test paradigm. The algorithm successively generates permutations of its input until it finds one that is sorted.</p>
          <h4 className="text-xl font-bold text-white mb-2">Complexity</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li><strong>Time:</strong> O(N * N!) average case. O(∞) worst case (it could literally run until the heat death of the universe).</li>
            <li><strong>Space:</strong> O(1) auxiliary space.</li>
          </ul>
          <h4 className="text-xl font-bold text-white mb-2">Real World Use Cases</h4>
          <p>Absolutely none. Bogo Sort is a joke algorithm used exclusively in computer science education to demonstrate how NOT to design an algorithm, and to explain concepts like factorial time complexity and infinite loops.</p>
        </>
      )
    }
  ];

  return (
    <div className="relative overflow-hidden pt-20 pb-16 flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
      <AlgorithmWikiModal title="Sorting Algorithms Wiki" sections={sortingWikiData} />
      
      {/* Background visual elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff] text-sm font-medium mb-6 backdrop-blur-md">
          v2.0 Single-Page Advanced Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00f3ff] mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          Sorting Arena
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
          Watch multiple algorithms compete in real-time. Configure datasets, adjust execution speeds, and analyze live performance metrics.
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;
