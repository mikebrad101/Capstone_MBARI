# Capstone_MBARI
# MBARI Expedition Database Modernization Project
This project aims to modernize the existing 25-year-old web application used by MBARI for scheduling ship time and managing data collected from our expeditions. The current application, built with Microsoft SQL Server and Perl Active Server pages, has reached its end of life. The goal is to create a new mission-critical tool using a modern software stack.

# Project Overview
The new application will have separate backend and frontend components communicating through a well-defined API. The system will support two main data entry pathways: the pre-cruise and post-cruise processes. Both processes require a user to be logged in with one of three roles: MBARI Employee, Registered User, or Logistics Coordinator.

The aim is to produce a minimal viable product that is easy to understand and navigate by a diverse group of users.

# Pre-cruise Process
The pre-cruise process involves an MBARI Employee submitting information for approval by the Logistics Coordinator before an expedition is scheduled. The information includes ship name, purpose, chief scientist, principal investigator, scheduled start and end datetime, equipment description, participants, region description, and planned track description.

# Post-cruise Process
The post-cruise process requires the science team to complete a form after an expedition. The form includes actual start and end datetime, accomplishments, scientist comments, whether scientific objectives were met, operator comments, whether all equipment functioned, other comments, and the ID of the person filling out the form. Registered Users can also enter Dive Start and End times for each dive conducted as part of the expedition.

# Reports
To verify the successful operation of the pre-cruise and post-cruise data entry, a reporting function must be provided that lists the Expeditions and the Dives related to them.
