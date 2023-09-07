import {Board} from "@/typings";
import formatTodosForAi from "@/lib/formatTodosForAi";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodosForAi(board);
    console.log('format to send >> ', todos);

    const res = await fetch('/api/generateSummary', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({todos})
    });

    const GPTData = await res.json();
    const {content} = GPTData;

    return content;
}

export default fetchSuggestion;