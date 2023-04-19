from typing import Generic, TypeVar
from backend.src.lib import Result

T = TypeVar('T')

class Node(Generic[T]):
    def __init__(self, label: T):
        self.value = label
        self.edges = []
        
class Graph(Generic[T]):
    def __init__(self, size: int):
        self.size = size
        self.adj_matrix = [[0 for _ in range(size)] for _ in range(size)]
        self.labels = []
        
    def set_labels(self, labels: list[T]):
        for label in labels:
            self.labels.append(label)
            
    def search_label(self, label: T) -> int:
        for i in range(len(self.labels)):
            if self.labels[i] == label:
                return i
        return -1
    
    def add_edge(self, from_label: T, to_label: T):
        from_index = self.search_label(from_label)
        to_index = self.search_label(to_label)
        
        if from_index == -1 or to_index == -1:
            return
        
        self.adj_matrix[from_index][to_index] = 1

def topological_sort(adj_matrix: list[list[int]]) -> Result[list[int], str]:
    """Generates a topological order of a graph.
    Algorithm: Kahn's algorithm.

    Args:
        adj_matrix (list[list[int]]): The adjacency matrix of the graph.
    """
    # Populate the in-degree list
    # The in-degree list tells how many nodes the node at the position is being dependant on
    n = len(adj_matrix)
    in_degree = [0] * n
    for j in range(n):
        for i in range(n):
            if adj_matrix[i][j] == 1:
                in_degree[j] += 1
    
    # push everything that has zero in-degree
    # a node that has zero in-degree means that it is no longer dependant
    stack = []
    for i in range(n):
        if in_degree[i] == 0:
            stack.append(i)
    
    # iterate through the stack
    # for every popped node, decrease the in-degree of its downstream dependant node
    # if it has reached zero in-degrees as well, then put it in the processing stack
    top_order = []
    while stack:
        u = stack.pop(0)
        top_order.append(u)
        for v in range(n):
            if adj_matrix[u][v] == 1:
                in_degree[v] -= 1
                if in_degree[v] == 0:
                    stack.append(v)
    
    # if the length of the topological order is less than the size of the adjacency matrix
    # this means there is at least one cycle, because a cycle cannot be truly reduced
    # like a reference cycle in Java, causing it to be never "collected".
    if len(top_order) != n:
        return Result.Err('Graph has a cycle.')
    else:
        return Result.Ok(top_order)
    
def matrix_transpose(mat: list[list[T]]) -> list[list[T]]:
    return [[mat[j][i] for j in range(len(mat))] for i in range(len(mat[0]))]

def main() -> None:
    adj_matrix = [
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]
    
    print(topological_sort(adj_matrix))
    pass

if __name__ == '__main__':
    main()
