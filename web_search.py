#!/usr/bin/env python3

import sys
from googlesearch import search

def web_search(query, num_results=10):
    """
    Perform a web search using Google search
    
    Args:
        query (str): The search query
        num_results (int): Number of results to return (default: 10)
    
    Returns:
        list: List of search result URLs
    """
    try:
        # Perform the search
        results = list(search(query, num_results=num_results, sleep_interval=1))
        return results
    except Exception as e:
        print(f"Error performing search: {e}")
        return []

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 web_search.py <query> [num_results]")
        sys.exit(1)
    
    query = sys.argv[1]
    num_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    print(f"Searching for: {query}")
    results = web_search(query, num_results)
    
    if results:
        print(f"\nTop {len(results)} results:")
        for i, url in enumerate(results, 1):
            print(f"{i}. {url}")
    else:
        print("No results found.")

if __name__ == "__main__":
    main()