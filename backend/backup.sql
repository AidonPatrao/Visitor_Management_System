--
-- PostgreSQL database dump
--

\restrict fiDrVX6bqIUS9gghwXAurumIeh97KK0mYsEz9CY2DTnm6leEnugzi4mAxQjwU5E

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'OPERATOR'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Departments" (
    "departmentId" integer NOT NULL,
    "departmentName" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Departments_departmentId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Departments_departmentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Departments_departmentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Departments_departmentId_seq" OWNED BY public."Departments"."departmentId";


--
-- Name: Employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Employees" (
    "employeeId" integer NOT NULL,
    "employeeName" text NOT NULL,
    "departmentId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Employees_employeeId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Employees_employeeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Employees_employeeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Employees_employeeId_seq" OWNED BY public."Employees"."employeeId";


--
-- Name: LookupMemberCounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LookupMemberCounts" (
    "memberCountId" integer NOT NULL,
    "memberCount" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LookupMemberCounts_memberCountId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LookupMemberCounts_memberCountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LookupMemberCounts_memberCountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LookupMemberCounts_memberCountId_seq" OWNED BY public."LookupMemberCounts"."memberCountId";


--
-- Name: LookupVehicleTypes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LookupVehicleTypes" (
    "vehicleTypeId" integer NOT NULL,
    "vehicleType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: LookupVehicleTypes_vehicleTypeId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LookupVehicleTypes_vehicleTypeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LookupVehicleTypes_vehicleTypeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LookupVehicleTypes_vehicleTypeId_seq" OWNED BY public."LookupVehicleTypes"."vehicleTypeId";


--
-- Name: Projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Projects" (
    "projectId" integer NOT NULL,
    "projectName" text NOT NULL,
    "departmentId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Projects_projectId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Projects_projectId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Projects_projectId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Projects_projectId_seq" OWNED BY public."Projects"."projectId";


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    "userId" integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'OPERATOR'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userName" text,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- Name: Users_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Users_userId_seq" OWNED BY public."Users"."userId";


--
-- Name: Visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visitors" (
    "visitorId" integer NOT NULL,
    "visitorName" text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    company text NOT NULL,
    "photoUrl" text NOT NULL,
    "visitingReason" text NOT NULL,
    "additionalMembersCount" integer NOT NULL,
    "additionalMembersNames" text,
    "vehicleNumber" text NOT NULL,
    "vehicleType" text NOT NULL,
    "departmentId" integer NOT NULL,
    "employeeId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Visitors_visitorId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Visitors_visitorId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Visitors_visitorId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Visitors_visitorId_seq" OWNED BY public."Visitors"."visitorId";


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Departments departmentId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Departments" ALTER COLUMN "departmentId" SET DEFAULT nextval('public."Departments_departmentId_seq"'::regclass);


--
-- Name: Employees employeeId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Employees" ALTER COLUMN "employeeId" SET DEFAULT nextval('public."Employees_employeeId_seq"'::regclass);


--
-- Name: LookupMemberCounts memberCountId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LookupMemberCounts" ALTER COLUMN "memberCountId" SET DEFAULT nextval('public."LookupMemberCounts_memberCountId_seq"'::regclass);


--
-- Name: LookupVehicleTypes vehicleTypeId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LookupVehicleTypes" ALTER COLUMN "vehicleTypeId" SET DEFAULT nextval('public."LookupVehicleTypes_vehicleTypeId_seq"'::regclass);


--
-- Name: Projects projectId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects" ALTER COLUMN "projectId" SET DEFAULT nextval('public."Projects_projectId_seq"'::regclass);


--
-- Name: Users userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "userId" SET DEFAULT nextval('public."Users_userId_seq"'::regclass);


--
-- Name: Visitors visitorId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors" ALTER COLUMN "visitorId" SET DEFAULT nextval('public."Visitors_visitorId_seq"'::regclass);


--
-- Data for Name: Departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Departments" ("departmentId", "departmentName", "createdAt", "updatedAt", "isActive") FROM stdin;
1	QA	2026-08-03 14:00:02.932	2026-08-03 14:00:02.932	t
8	Tester	2026-08-04 14:05:26.336	2026-08-04 14:38:16.159	f
2	HR	2026-08-03 14:00:02.932	2026-08-04 22:39:17.409	f
9	Security	2026-08-04 22:29:13.513	2026-08-05 07:33:30.526	t
10	Wellness	2026-08-05 07:33:01.959	2026-08-05 07:34:40.538	t
11	Management	2026-08-05 07:36:35.917	2026-08-05 07:36:44.882	t
7	Maintenance	2026-08-03 15:03:04.9	2026-08-05 07:45:43.598	t
3	Mechanical	2026-08-03 14:00:02.932	2026-08-06 12:30:11.744	t
12	Engineering	2026-08-06 12:30:25.551	2026-08-06 12:30:34.53	t
\.


--
-- Data for Name: Employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Employees" ("employeeId", "employeeName", "departmentId", "createdAt", "updatedAt", "isActive") FROM stdin;
1	Aarav Sharma	1	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
2	Priya Nair	1	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
3	Rohan D'Souza	1	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
4	Neha Verma	2	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
5	Karan Mehta	2	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
6	Ananya Rao	2	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
7	Vikram Iyer	3	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
8	Sneha Kulkarni	3	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
9	Rahul Patil	3	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
10	Suresh Kumar	7	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
11	Mahesh Gowda	7	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
12	Ramesh Shetty	7	2026-08-03 16:08:11.165	2026-08-03 16:08:11.165	t
13	N/A	7	2026-08-18 09:07:48.255	2026-08-18 09:07:48.255	t
\.


--
-- Data for Name: LookupMemberCounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LookupMemberCounts" ("memberCountId", "memberCount", "createdAt", "updatedAt") FROM stdin;
11	0	2026-08-12 20:15:02.647	2026-08-12 20:15:02.647
12	1	2026-08-12 20:15:04.634	2026-08-12 20:15:04.634
13	2	2026-08-12 20:15:06.216	2026-08-12 20:15:06.216
14	3	2026-08-12 20:15:08.446	2026-08-12 20:15:08.446
15	4	2026-08-12 20:15:10.751	2026-08-12 20:15:10.751
17	5+	2026-08-12 20:15:23.856	2026-08-12 20:15:23.856
\.


--
-- Data for Name: LookupVehicleTypes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LookupVehicleTypes" ("vehicleTypeId", "vehicleType", "createdAt", "updatedAt") FROM stdin;
1	No-Vehicle	2026-08-12 11:21:26.282	2026-08-12 11:21:26.282
2	2-Wheeler	2026-08-12 11:21:44.947	2026-08-12 11:21:44.947
3	3-Wheeler	2026-08-12 11:21:54.61	2026-08-12 11:21:54.61
4	4-Wheeler	2026-08-12 11:22:05.859	2026-08-12 11:22:05.859
5	Heavy/Commercial	2026-08-12 11:24:10.751	2026-08-12 11:24:10.751
\.


--
-- Data for Name: Projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Projects" ("projectId", "projectName", "departmentId", "createdAt", "updatedAt", "isActive") FROM stdin;
2	test-admin-feature	1	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
3	Traceify	1	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
4	Project Nexus	2	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
5	PeoplePulse	2	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
7	Project Equinox	3	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
10	None	7	2026-08-03 15:19:22.426	2026-08-03 15:19:22.426	t
6	TalentFlow	2	2026-08-03 15:19:22.426	2026-08-11 12:00:26.999	t
9	LedgerSync	3	2026-08-03 15:19:22.426	2026-08-11 12:02:10.381	t
8	FinSight	3	2026-08-03 15:19:22.426	2026-08-11 12:22:36.223	t
11	m1	3	2026-08-11 12:36:02.622	2026-08-11 12:36:02.622	t
12	Maintenance	7	2026-08-11 12:38:46.706	2026-08-11 12:38:46.706	t
1	test-website	1	2026-08-03 15:19:22.426	2026-08-11 13:10:46.035	f
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" ("userId", email, password, role, "createdAt", "updatedAt", "userName", "isActive") FROM stdin;
1	admin@invenger.com	$2b$10$h5efHXgwLoNukEGzUJekLuactQE9v6iITPMQ68j/SqLK4OUnkSEIm	ADMIN	2026-08-02 22:00:01.173	2026-08-02 22:00:01.173	Admin	t
4	a@a.com	$2b$10$X5ysc0Wj6nFcSSfZ4YI6b.tk98MhSEj3xBK3MKT97AmkfsD9Q578m	OPERATOR	2026-08-12 16:34:00.145	2026-08-12 16:34:00.145	Operator-1	t
\.


--
-- Data for Name: Visitors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Visitors" ("visitorId", "visitorName", phone, email, address, company, "photoUrl", "visitingReason", "additionalMembersCount", "additionalMembersNames", "vehicleNumber", "vehicleType", "departmentId", "employeeId", "projectId", "createdBy", "createdAt", "updatedAt") FROM stdin;
1	gfrgr	rgrgrgr	b@b.com	grgrgr	rgrgrgrg	https://via.placeholder.com/150	rgrgrg	0	rgrgr	rgrgrgr	2-Wheeler	11	5	7	a@a.com	2026-08-12 16:38:00.496	2026-08-12 16:38:00.496
2	gdsgrgrg	grgrg	a@a.com	rgrgr	rgrgr	https://via.placeholder.com/150	rgrg	4	rgrgrgr	rgrg	3-Wheeler	11	8	11	a@a.com	2026-08-12 16:49:22.552	2026-08-12 16:49:22.552
3	Aidon Patrao	2916190387	aidonpatrao073@gmail.com	Bengaluru	infosys	https://via.placeholder.com/150	Client Insight	0	\N	KA-19-AB-1234	4-Wheeler	12	12	8	a@a.com	2026-08-12 18:42:47.204	2026-08-12 18:42:47.204
4	Aidon Patrao	2916190387	aidonpatrao073@gmail.com	Bengaluru	infosys	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786562214009_EgjP-a9CE.jpg	Client Insight	0	\N	KA-19-AB-1234	2-Wheeler	11	7	6	a@a.com	2026-08-12 19:16:55.614	2026-08-12 19:16:55.614
5	Aidon Patrao	2916190387	aidonpatrao073@gmail.com	Bengaluru	infosys	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786562388122_u88ZtAbDs.jpg	Official	0	\N	KA-19-AB-1234	4-Wheeler	11	10	11	a@a.com	2026-08-12 19:19:49.422	2026-08-12 19:19:49.422
6	sdsd	sdsd	a@a.com	dsds	sdsd	https://via.placeholder.com/150	Official	0	\N	sdsds	3-Wheeler	11	2	11	a@a.com	2026-08-12 19:27:02.45	2026-08-12 19:27:02.45
7	tgtg	tgt	a@a.com	fvf	fvf	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786563069974_CW4QEEkZ2.jpg	Official	0	\N	KA-19-AB-1234	Heavy/Commercial	7	12	12	a@a.com	2026-08-12 19:31:11.523	2026-08-12 19:31:11.523
8	efewf	efef	a@a.com	efef	eeffefee	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786563296706_x92o63-dK.jpg	Official	0	\N	KA-19-AB-1234	3-Wheeler	7	12	5	a@a.com	2026-08-12 19:34:58.002	2026-08-12 19:34:58.002
9	fefe	efefe	aidonpatrao073@gmail.com	fefe	efef	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786563732120_1yEnzPH57.jpg	Official	0	\N	KA-19-AB-1234	4-Wheeler	3	9	12	a@a.com	2026-08-12 19:42:13.516	2026-08-12 19:42:13.516
10	Aidon Patrao	rgrgrgr	aidonpatrao073@gmail.com	Bengaluru	wsefdrftyg	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1786564284400_Lgiggxrns.jpg	Client Insight	2	Soham ,Rohan	KA-19-AB-1234	3-Wheeler	3	3	7	a@a.com	2026-08-12 19:51:25.746	2026-08-12 19:51:25.746
11	Aidon Patrao	2916190387	aidonpatrao073@gmail.com	Bengaluru	wsefdrftyg	https://ik.imagekit.io/z85uz9ahd/visitors/visitor_1787046625079_rPDgc9P7e.jpg	Client Insight	0	\N	KA-19-AB-1234	3-Wheeler	7	13	10	a@a.com	2026-08-18 09:50:26.851	2026-08-18 09:50:26.851
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
64d27a65-bb90-4aaa-82b0-aae118274df1	3b3c3791290f2e665c0be92f1882b663ab89afd17123a66272d0602ca1cc1b9b	2026-08-02 14:50:58.201287+05:30	20260802092058_added_users_table	\N	\N	2026-08-02 14:50:58.190481+05:30	1
f66cb131-656c-413f-9c84-37db5a1721d4	b7faf5241bbe05508839ebb361320819c72c4ec32cc75a3f859996485fe8915b	2026-08-02 18:19:38.664705+05:30	20260802124938_schema_completed	\N	\N	2026-08-02 18:19:38.551719+05:30	1
832dc1ed-3bb7-4894-8760-9e6cf872e3dd	406b2b9ff9ba457b6d4a1f7d20b2fd409d76d5a98c4c17d9034fdd82d1a8d565	2026-08-03 20:22:38.579615+05:30	20260803145238_is_active_column_switch	\N	\N	2026-08-03 20:22:38.50601+05:30	1
a9e1f6c0-4de5-4cdc-816d-603dbdec73e7	ce8ec7f38fdb8d3394fcfda69e3bba81386a2ad720eba9f27a4d8dcb8d2309a3	2026-08-11 23:19:26.324323+05:30	20260811174926_added_is_active_to_users	\N	\N	2026-08-11 23:19:26.255662+05:30	1
13bd6e95-4593-427a-88c8-7ae4d80fb1be	c44744feb2d6c0e5296a8ac944d3899c78baf1ded1563975bc363889d81a53b9	2026-08-12 13:21:35.728682+05:30	20260812075135_added_vechicle_type_and_member_count_configuration	\N	\N	2026-08-12 13:21:35.660189+05:30	1
\.


--
-- Name: Departments_departmentId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Departments_departmentId_seq"', 12, true);


--
-- Name: Employees_employeeId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Employees_employeeId_seq"', 13, true);


--
-- Name: LookupMemberCounts_memberCountId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LookupMemberCounts_memberCountId_seq"', 17, true);


--
-- Name: LookupVehicleTypes_vehicleTypeId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LookupVehicleTypes_vehicleTypeId_seq"', 5, true);


--
-- Name: Projects_projectId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Projects_projectId_seq"', 12, true);


--
-- Name: Users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Users_userId_seq"', 4, true);


--
-- Name: Visitors_visitorId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Visitors_visitorId_seq"', 11, true);


--
-- Name: Departments Departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY ("departmentId");


--
-- Name: Employees Employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_pkey" PRIMARY KEY ("employeeId");


--
-- Name: LookupMemberCounts LookupMemberCounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LookupMemberCounts"
    ADD CONSTRAINT "LookupMemberCounts_pkey" PRIMARY KEY ("memberCountId");


--
-- Name: LookupVehicleTypes LookupVehicleTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LookupVehicleTypes"
    ADD CONSTRAINT "LookupVehicleTypes_pkey" PRIMARY KEY ("vehicleTypeId");


--
-- Name: Projects Projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_pkey" PRIMARY KEY ("projectId");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("userId");


--
-- Name: Visitors Visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors"
    ADD CONSTRAINT "Visitors_pkey" PRIMARY KEY ("visitorId");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Departments_departmentName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Departments_departmentName_key" ON public."Departments" USING btree ("departmentName");


--
-- Name: LookupMemberCounts_memberCount_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LookupMemberCounts_memberCount_key" ON public."LookupMemberCounts" USING btree ("memberCount");


--
-- Name: LookupVehicleTypes_vehicleType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LookupVehicleTypes_vehicleType_key" ON public."LookupVehicleTypes" USING btree ("vehicleType");


--
-- Name: Projects_projectName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Projects_projectName_key" ON public."Projects" USING btree ("projectName");


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: Employees Employees_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Departments"("departmentId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Projects Projects_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Projects"
    ADD CONSTRAINT "Projects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Departments"("departmentId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Visitors Visitors_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors"
    ADD CONSTRAINT "Visitors_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Visitors Visitors_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors"
    ADD CONSTRAINT "Visitors_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Departments"("departmentId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Visitors Visitors_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors"
    ADD CONSTRAINT "Visitors_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employees"("employeeId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Visitors Visitors_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visitors"
    ADD CONSTRAINT "Visitors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Projects"("projectId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict fiDrVX6bqIUS9gghwXAurumIeh97KK0mYsEz9CY2DTnm6leEnugzi4mAxQjwU5E

