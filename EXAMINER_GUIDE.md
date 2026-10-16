# CuroVex Examiner Demo Guide

## Recommended Presentation Sequence (5-7 Minutes)
1. **Landing Page**: Open `http://localhost:3000`. Point out the "Demonstration Mode Active" badge.
2. **Dashboard & Search**: Click "Launch Dashboard". Type "Alzheimer" in the search bar. Highlight "Aspirin" as a Repurposing Candidate (Score: 0.75).
3. **Explanation Deep Dive**: Click on "Aspirin". Toggle between **Path-Based** (baseline meta-paths) and **Counterfactual** (novel contribution). Point to the Edge Impact Table showing how masking the `PTGS2 → APP` edge drops the score (Fidelity: 40%).
4. **External Validation**: Show the ClinicalTrials.gov and PubMed cards. Emphasize the disclaimer about computational hypotheses.

## Anticipated Questions
- **Q: Is this running live Neo4j queries?** A: No. The demo uses precomputed JSON subgraphs derived from the actual pipeline's output format to guarantee reliability on a student laptop.
- **Q: How is Fidelity calculated?** A: Fidelity = (Original Score - Masked Score) / |Original Score|.
