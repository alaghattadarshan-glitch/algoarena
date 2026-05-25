export const generateCommentary = (metrics, winner, arraySize, arrayType) => {
  if (!winner || !metrics || !metrics[winner]) return "Race complete. Analyzing data...";
  
  const winnerStats = metrics[winner];
  const otherAlgos = Object.keys(metrics).filter(a => a !== winner);
  
  let commentary = `Race concluded! 🏆 **${winner}** secured the victory in just ${winnerStats.time}ms. `;
  
  if (otherAlgos.length > 0) {
    const slowest = otherAlgos.reduce((a, b) => {
      // Handle cases where some might not have finished
      if (!metrics[a].time) return b;
      if (!metrics[b].time) return a;
      return (Number(metrics[a].time) > Number(metrics[b].time)) ? a : b;
    });
    
    if (metrics[slowest].time) {
      const timeDiff = (Number(metrics[slowest].time) - Number(winnerStats.time)).toFixed(2);
      commentary += `It outpaced the slowest competitor (${slowest}) by a massive ${timeDiff}ms gap. `;
    }
    
    // Intelligent rules based on array type and winner
    if (arrayType === 'sorted' && winner === 'Insertion Sort') {
      commentary += `As expected on a pre-sorted array, Insertion Sort dominated due to its O(N) best-case time complexity, requiring exactly zero swaps. `;
    } else if (arrayType === 'reverse' && winner === 'Quick Sort') {
      commentary += `Quick Sort handled the reverse-sorted array beautifully, proving why its divide-and-conquer strategy is industry standard. `;
    } else if (winner === 'Quick Sort' || winner === 'Merge Sort') {
      commentary += `The optimized divide-and-conquer approach allowed ${winner} to chew through the ${arraySize} elements efficiently with an O(N log N) curve. `;
    } else if (winner === 'Bubble Sort') {
      commentary += `Surprisingly, Bubble Sort pulled ahead here! This usually only happens on extremely small datasets or highly optimized arrays. `;
    }
    
    // Compare memory swaps
    const lowestSwapsAlgo = Object.keys(metrics).reduce((a, b) => metrics[a].swaps < metrics[b].swaps ? a : b);
    if (lowestSwapsAlgo !== winner && metrics[lowestSwapsAlgo].swaps > 0) {
      commentary += `Interestingly, ${lowestSwapsAlgo} made fewer memory swaps (${metrics[lowestSwapsAlgo].swaps} vs ${winnerStats.swaps}), but ${winner} won on raw algorithmic efficiency. `;
    }
  }

  return commentary;
};
