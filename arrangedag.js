//Arrange nodes and node inputs of a DAG (directed acyclic graph)
//

/**
 * @param {(dag: any) => any[]} nodesFn
 * @param {(node: any, dag: any) => boolean} areNodeInputsInterchangeableFn
 * @param {(node: any, dag: any) => any[]} nodeInputsFn
 * @param {(nodeInputs: any[]) => void} sortNodeInputsFn
 * @param {(nodeInputs: any[], node: any, dag: any) => void} setNodeInputsFn
 * @param {(dag: any) => any[]} nodeIdsInAscendingOrderFn
 *
 * @param {(nodeId1:any,nodeId2:any, dag:any)=>boolean} isNodeValueLesserThanOrEqualToFn
 * whether node value for nodeId1 is lesser than or equal to node value for
 * nodeId2
 *
 * @param {any} shouldNodeIdXHaveALesserIdThanNodeIdYFn
 * @param {any} interChangeNodeValuesFn
 * @param {any} replaceNodeIdReferencesThroughoutDagFn
 */
export function configArrangeDag(
  nodesFn,
  areNodeInputsInterchangeableFn,
  nodeInputsFn,
  sortNodeInputsFn,
  setNodeInputsFn,
  nodeIdsInAscendingOrderFn,
  isNodeValueLesserThanOrEqualToFn,
  shouldNodeIdXHaveALesserIdThanNodeIdYFn,
  interChangeNodeValuesFn,
  replaceNodeIdReferencesThroughoutDagFn
) {
  nodes = nodesFn;
  nodeInputs = nodeInputsFn;
  areNodeInputsInterchangeable = areNodeInputsInterchangeableFn;
  sortNodeInputs = sortNodeInputsFn;
  setNodeInputs = setNodeInputsFn;
  nodeIdsInAscendingOrder = nodeIdsInAscendingOrderFn;
  isNodeValueLesserThanOrEqualTo = isNodeValueLesserThanOrEqualToFn;
  shouldNodeIdXHaveALesserIdThanNodeIdY =
    shouldNodeIdXHaveALesserIdThanNodeIdYFn;
  interChangeNodeValues = interChangeNodeValuesFn;
  replaceNodeIdReferencesThroughoutDag = replaceNodeIdReferencesThroughoutDagFn;
}

/**
 * @param {any} dag_
 */
export function arrangeDag(dag_) {
  dag = dag_;
  arrangeDagNodeInputs();
  arrangeDagNodes();
}

function arrangeDagNodeInputs() {
  for (const node of nodes(dag)) {
    if (!areNodeInputsInterchangeable(node, dag)) {
      continue;
    }
    const inputs = nodeInputs(node, dag);
    sortNodeInputs(inputs);
    setNodeInputs(node, dag, inputs);
  }
}

function arrangeDagNodes() {
  let wasChangeMade = true;
  while (wasChangeMade) {
    wasChangeMade = false;
    let prevNodeId = null;
    for (idOfNodeToInterchange of nodeIdsInAscendingOrder(dag)) {
      assert(prevNodeId == null || idOfNodeToInterchange > prevNodeId);
      getIdOfNodeToInterchangeWith();
      if (idOfNodeToInterchangeWith == null) {
        continue;
      }
      interChangeNodeValues(idOfNodeToInterchange, idOfNodeToInterchangeWith);
      replaceNodeIdReferencesThroughoutDag(
        idOfNodeToInterchange,
        idOfNodeToInterchangeWith,
        dag
      );
      replaceNodeIdReferencesThroughoutDag(
        idOfNodeToInterchangeWith,
        idOfNodeToInterchange,
        dag
      );
      wasChangeMade = true;
      //break; don't break, keep rearranging remaining nodes with the expectation
      //that chance of needing to rearranging the previous nodes is low.
    }
  }
}

function getIdOfNodeToInterchangeWith() {
  for (idOfNodeToInterchangeWith of nodeIdsInAscendingOrder(dag)) {
    if (
      isNodeValueLesserThanOrEqualTo(
        idOfNodeToInterchangeWith,
        idOfNodeToInterchange,
        dag
      )
    ) {
      continue;
    }
    if (
      shouldNodeIdXHaveALesserIdThanNodeIdY(
        idOfNodeToInterchangeWith,
        idOfNodeToInterchange
      )
    ) {
      return;
    }
  }
  idOfNodeToInterchangeWith = null;
}

let idOfNodeToInterchangeWith;
let idOfNodeToInterchange;
let dag;
let replaceNodeIdReferencesThroughoutDag;
let interChangeNodeValues;
let shouldNodeIdXHaveALesserIdThanNodeIdY;

/**
 * @type {(nodeId1:any,nodeId2:any, dag:any)=>boolean}
 */
let isNodeValueLesserThanOrEqualTo;

let areNodeInputsInterchangeable;
let setNodeInputs;
let nodes;
let nodeInputs;
let sortNodeInputs;
let nodeIdsInAscendingOrder;

/**
 * @param {boolean} x
 */
function assert(x) {
  if (!x) {
    throw new Error("assertion failed");
  }
}
