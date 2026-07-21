
/* @jsxRuntime classic */
const {useState,useEffect,useRef,useMemo,createContext,useContext}=React;
/* ===== Supabase ===== */
const SUPA_URL="https://uazinektdhnqibwznnmu.supabase.co";
const SUPA_KEY="sb_publishable_I7XfLRs48wPtgL8FV3MxDA_oL8QO9G9";
const supa=(window.supabase&&window.supabase.createClient)?window.supabase.createClient(SUPA_URL,SUPA_KEY):null;
/* ===== ICONS ===== */
const I={
  note:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  grid:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/></svg>,
  folder:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  users:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 6a3 3 0 010 6M18 19c0-2-.7-3.4-2-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  cal:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  chat:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  bell:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M18 9a6 6 0 10-12 0c0 6-2 7-2 7h16s-2-1-2-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8"/></svg>,
  search:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  play:(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.5v13l11-6.5z"/></svg>,
  pause:(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="5" width="4" height="14" rx="1.3"/><rect x="14" y="5" width="4" height="14" rx="1.3"/></svg>,
  plus:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  check:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  back:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  down:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  up:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  clock:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bolt:(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>,
  star:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  starF:(p)=><svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>,
  lock:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  shield:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  sun:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  moon:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  drive:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M8 3h8l5 9-4 7H7l-4-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 3l4 9m0 0H3m9 0l-5 7m5-7l5-7m-5 7h9" stroke="currentColor" strokeWidth="1.2" opacity=".5"/></svg>,
  activity:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12h4l2 6 4-14 2 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wave:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12h2M7 7v10M11 4v16M15 8v8M19 11v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  settings:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 006.8 19l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 13.4H3a2 2 0 110-4h.1A1.6 1.6 0 005 6.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H12a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  globe:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7"/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" stroke="currentColor" strokeWidth="1.4"/></svg>,
  dollar:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 2.6 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  receipt:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 3v18l2-1.3L9 21l2-1.3L13 21l2-1.3L17 21l2-1.3V3l-2 1.3L15 3l-2 1.3L11 3 9 4.3 7 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 8.5h8M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  contract:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 3h7l5 5v9a3 3 0 01-3 3H7a3 3 0 01-3-3V6a3 3 0 013-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 3v5h5M8 13h6M8 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  inbox:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 13l2.5-7.5A2 2 0 018.4 4h7.2a2 2 0 011.9 1.5L20 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 13h4l1.5 2.5h5L16 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  send:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M21 3L10.5 13.5M21 3l-6.5 18-4-8-8-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  pen:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 21l4-1 12-12-3-3L4 17z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 6l3 3" stroke="currentColor" strokeWidth="1.7"/></svg>,
  cloud:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 18a4 4 0 01-.5-7.97A6 6 0 0118 9.5a3.5 3.5 0 01-.5 8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 14V9m0 0l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  layers:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l9 5-9 5-9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  disc:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7"/></svg>,
  chevR:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevD:(p)=><svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ===== i18n ===== */
const LANGS=[{c:"en",flag:"🇬🇧",name:"English",native:"English"},{c:"vi",flag:"🇻🇳",name:"Vietnamese",native:"Tiếng Việt"},{c:"hi",flag:"🇮🇳",name:"Hindi",native:"हिन्दी"}];
const STRINGS={
  en:{
    tagline:"Music production, managed beautifully.",pickRole:"Select a role to enter the demo · 100% anonymous & moderated",
    role_admin:"Administrator",role_client:"Client",role_artist:"Artist",
    rd_admin:"Full control: projects, users, permissions, finances, deliveries.",rd_client:"Review demos, approve versions, sign MOUs and pay invoices.",rd_artist:"Receive briefs, upload masters & stems, track your earnings.",
    workspace:"Workspace",portal:"Client portal",studio:"Studio",menu:"Menu",quick:"Quick access",
    nav_dashboard:"Dashboard",nav_home:"Home",nav_projects:"Projects",nav_assigned:"Assigned",nav_myprojects:"My projects",nav_requests:"Requests",nav_contracts:"Contracts",nav_invoices:"Invoices",nav_payments:"Payments",nav_earnings:"Earnings",nav_calendar:"Calendar",nav_deliveries:"Deliveries",nav_drive:"Drive",nav_files:"Files",nav_users:"Users",nav_settings:"Settings",
    search:"Search everything…",searchHint:"Search projects, actions…",notifications:"Notifications",markRead:"Mark read",signout:"Sign out",switchRole:"Switch role: reload the demo",noResults:"No results",
    goodAfternoon:"Good afternoon",viewAll:"View all",newProject:"New project",
    st_pending:"Pending",st_progress:"In progress",st_review:"In review",st_approved:"Approved",st_delivered:"Delivered",
    pr_low:"Low",pr_medium:"Medium",pr_high:"High",pr_urgent:"Urgent",
    activeProjects:"Active projects",inReview:"In review",deliveredMonth:"Delivered (mo.)",activeArtists:"Active artists",outstanding:"Outstanding",toPay:"To pay artists",
    needsReview:"Needs your review",recentActivity:"Recent project activity",activityCenter:"Activity center",upcoming:"Upcoming deliveries",
    anonymous:"Anonymous",anonClient:"Anonymous client",anonArtist:"Anonymous artist",clientHidden:"artist identity protected",artistHidden:"client identity protected",fullMgmt:"full management",
    kanban:"Kanban",list:"List",projectsCount:"projects",
    tab_overview:"Overview",tab_versions:"Versions",tab_comments:"Comments",tab_files:"Files",tab_chat:"Chat",tab_songs:"Songs",tab_mou:"MOU",
    approve:"Approve",requestChanges:"Request changes",reject:"Reject",uploadVersion:"Upload version",markDone:"Mark done",approveDelivery:"Approve delivery",permissions:"Permissions",
    deliver:"Delivery",versions:"versions",brief:"Project brief",timeline:"Timeline",completed:"completed",projectFolder:"Project folder synced",viewFiles:"View all files",
    addComment:"Add a timestamped comment…",comment:"Comment",noComments:"No comments yet",latest:"Latest",changesRequested:"Changes requested",
    moderatedChat:"Moderated chat · identity protected",chatNotice:"This chat is only for discussing the project. Contact details and external links are blocked automatically.",msgBlocked:"Message blocked: it looks like it contains contact details, a link or social media. Keep communication inside the project.",typeMsg:"Type a message about the project…",
    driveTitle:"Google Drive",driveSub:"One folder per client · auto-structured, auto-named",namingConvention:"Naming convention",autoStructure:"Auto folder structure",master:"Master",stems:"Stems",uploadFiles:"Upload files",dropHere:"Drag files here or click to upload — they'll be auto-renamed",recentFiles:"Recent files",syncedDrive:"synced with Drive",openInDrive:"Open in Drive",
    songs:"Songs",song:"Song",addSong:"Add song",masterStems:"Master & stems pricing",perSong:"Per song",total:"Total",
    requestsTitle:"Project requests",newRequest:"New request",requestSongs:"How many songs?",budget:"Budget preference",notes:"Notes",submitRequest:"Submit request",approveReq:"Approve",negotiate:"Negotiate",decline:"Decline",reqStatus_new:"New",reqStatus_negotiating:"Negotiating",reqStatus_approved:"Approved",reqStatus_declined:"Declined",proposeRate:"Propose rate",
    contractsTitle:"Contracts & MOUs",mou:"MOU",agreement:"Agreement",awaitingSig:"Awaiting signature",signed:"Signed",signedByUs:"Signed by Ideal Music",signNow:"Sign now",sendContract:"Send contract",party_client:"Client",party_artist:"Artist",mouIntro:"This Memorandum of Understanding is pre-signed by Ideal Music and only requires the client's signature to begin the brief.",yourSignature:"Your signature",
    invoicesTitle:"Invoices",generateInvoice:"Generate invoice",inv_draft:"Draft",inv_sent:"Sent",inv_partial:"Partial",inv_paid:"Paid",invNumber:"Invoice #",issued:"Issued",dueDate:"Due",billTo:"Bill to",amount:"Amount",subtotal:"Subtotal",paid:"Paid",balance:"Balance",send:"Send",download:"Download",qty:"Qty",rate:"Rate",description:"Description",
    paymentsTitle:"Payments & pipeline",receivables:"Receivables (from clients)",payouts:"Payouts (to artists)",financialPipeline:"Financial pipeline",whoToPay:"Who needs to be paid",payout_pending:"Pending",payout_scheduled:"Scheduled",payout_paid:"Paid",markPaid:"Mark paid",schedule:"Schedule",collected:"Collected",
    usersTitle:"Users & permissions",inviteUser:"Invite user",people:"People",permMatrix:"Permission matrix",permHint:"Tap each module to raise the level: View → Comment → Approve → Edit → Admin.",save:"Save",mod_projects:"Projects",mod_files:"Files",mod_comments:"Comments",mod_chat:"Chat",mod_deliveries:"Deliveries",mod_users:"Users",mod_finance:"Finance",lvl_none:"No access",lvl_view:"View",lvl_comment:"Comment",lvl_approve:"Approve",lvl_edit:"Edit",lvl_admin:"Admin",
    settingsTitle:"Settings",language:"Language",languageSub:"English is always the default. Change it anytime.",companyInfo:"Company information",companySub:"Used as defaults for invoices and the MOU. Editable placeholders.",appearance:"Appearance",lightMode:"Light",darkMode:"Dark",legalName:"Legal name",address:"Address",taxId:"Tax / Reg. ID",email:"Email",signatory:"Signatory",currency:"Currency",saveChanges:"Save changes",
    calTitle:"Delivery calendar",calSub:"July 2026 · automatic reminders active",cancel:"Cancel",create:"Create project",
    mouStep:"MOU",mouPending:"MOU pending the client's signature",mouSignedMsg:"MOU signed — brief can proceed",workflow:"Workflow",
    title:"Title",artistF:"Artist",clientF:"Client",priority:"Priority",deliveryDate:"Delivery date",progress:"Progress",status:"Status",
    signInSub:"Use your passkey to continue securely.",passkeyBtn:"Sign in with Passkey",faceTouch:"Face ID · Touch ID · security key",exploreDemo:"Explore the demo without signing in",verifying:"Verifying…",authed:"Authenticated",welcome:"Welcome back",chooseProfile:"Choose a profile to continue",endToEnd:"Private, anonymous & moderated by design",passkeyError:"Couldn't verify your passkey. Try again, or explore the demo.",tryAgain:"Try again",orEmail:"or",emailContinue:"Continue with email",emailPlaceholder:"you@email.com",sendLink:"Send sign-in link",checkEmail:"Check your email",checkEmailSub:"We sent a secure sign-in link to your inbox. Open it on this device to continue.",back:"Back",
    nav_myfiles:"My Files",myFilesTitle:"My Files",myFilesSub:"Your projects — view and download your files. Everything here is private to you.",downloadFiles:"Download files",preparing:"Preparing your download",driveSoon:"Your Google Drive folder will appear here once your project is set up.",noFilesYet:"No files yet.",openInvoice:"Open",created:"Created",overdue:"Overdue",invPending:"Pending & overdue",invHistory:"Paid history",invClientSub:"Your invoices — pending and overdue are shown first.",noPending:"You're all caught up — no pending invoices.",serviceType:"Service",
    role_superadmin:"Super Admin",rd_superadmin:"Everything Admins can do — plus branding, roles and global settings.",loginScreen:"Login Screen",loginScreenSub:"Customize what visitors see on the sign-in screen. Only Super Admins can change this.",background:"Background",overlay:"Overlay",mediaUrl:"Media URL",uploadFile:"Upload file",fit:"Fit",loop:"Loop",intensity:"Intensity",speed:"Speed",opacityL:"Opacity",livePreview:"Live preview",resetDefault:"Reset to default",loginSaved:"Login screen updated",loginReset:"Reset to default.",accounting:"Accounting",accountingSub:"Money in and out, net balance and trends — updates as invoices change.",moneyIn:"Money in",moneyOut:"Money out",pendingIncome:"Pending income",netBalance:"Net balance",incomeVsExpense:"Income vs Expenses",paidVsPending:"Paid vs Pending",netEvolution:"Net balance over time",topClients:"Top clients",revenueByService:"Revenue by service",allClients:"All clients",allStatuses:"All statuses",p_day:"Day",p_week:"Week",p_month:"Month",p_quarter:"Quarter",p_year:"Year",p_custom:"Custom",markPaidTitle:"Mark invoice as paid",markPaidShort:"Mark paid",paymentDate:"Payment date",paymentMethod:"Payment method",reference:"Reference",internalNotes:"Internal notes",recordedBy:"Recorded by",markedPaid:"Invoice marked as paid",sendReminder:"Send reminder",reminderSent:"Reminder sent",inviteSub:"They will get a branded email to set up their account.",inviteSent:"Invitation sent",sendInvite:"Send invite",linkCopied:"Link copied",copy:"Copy",permSuperNote:"As a Super Admin you can invite anyone, create admins and super admins, change roles and deactivate users.",permAdminNote:"As an Admin you can invite artists and clients and create admins. Only Super Admins manage super admins.",active:"Active",inactive:"Inactive",deactivate:"Deactivate",activate:"Activate",superOnly:"Super Admin only",obTitle:"Welcome to Ideal Music",obSub:"Set up your account and company details.",obStep1:"You",obStep2:"Company",obStep3:"Billing",obName:"Your name",obCompany:"Company name",obPhone:"Phone",obCountry:"Country",obLegal:"Legal / registered name",obTaxId:"Tax ID / RFC / VAT",obNeedInvoice:"Need a fiscal invoice?",obExtra:"Anything else for invoicing?",obExtraPh:"PO number, billing contact, etc.",obFinish:"Finish setup",obDone:"You are all set",obDoneSub:"Your details are saved. We will be in touch and your projects will appear here.",next:"Continue",yes:"Yes",no:"No",importTitle:"Import",importSub:"Bring in existing clients, projects and history.",bulkCsv:"Bulk (CSV)",manual:"Manual",pasteCsv:"Paste CSV or upload a file",preview:"Preview",rowsDetected:"rows detected",willImport:"will import",duplicates:"duplicates",withErrors:"with errors",missing:"Missing",existing:"Already exists",new:"New",confirmImport:"Confirm import",imported:"records imported",addRecord:"Add record",remindersTitle:"Payment reminders",remindersSub:"Automatic branded reminders sent via email. Configure when they go out.",rmBefore:"Before due date (days)",rmOnDue:"On the due date",rmAfter:"After due date (days)",rmRecurring:"Recurring while pending (every N days)",
  },
  vi:{
    tagline:"Sản xuất âm nhạc, quản lý tinh tế.",pickRole:"Chọn vai trò để vào bản demo · 100% ẩn danh & kiểm duyệt",
    role_admin:"Quản trị viên",role_client:"Khách hàng",role_artist:"Nghệ sĩ",
    rd_admin:"Toàn quyền: dự án, người dùng, quyền, tài chính, bàn giao.",rd_client:"Duyệt demo, phê duyệt phiên bản, ký MOU và thanh toán hóa đơn.",rd_artist:"Nhận brief, tải master & stems, theo dõi thu nhập.",
    workspace:"Không gian làm việc",portal:"Cổng khách hàng",studio:"Studio",menu:"Menu",quick:"Truy cập nhanh",
    nav_dashboard:"Bảng điều khiển",nav_home:"Trang chủ",nav_projects:"Dự án",nav_assigned:"Được giao",nav_myprojects:"Dự án của tôi",nav_requests:"Yêu cầu",nav_contracts:"Hợp đồng",nav_invoices:"Hóa đơn",nav_payments:"Thanh toán",nav_earnings:"Thu nhập",nav_calendar:"Lịch",nav_deliveries:"Bàn giao",nav_drive:"Drive",nav_files:"Tệp",nav_users:"Người dùng",nav_settings:"Cài đặt",
    search:"Tìm kiếm mọi thứ…",searchHint:"Tìm dự án, thao tác…",notifications:"Thông báo",markRead:"Đánh dấu đã đọc",signout:"Đăng xuất",switchRole:"Đổi vai trò: tải lại demo",noResults:"Không có kết quả",
    goodAfternoon:"Chào buổi chiều",viewAll:"Xem tất cả",newProject:"Dự án mới",
    st_pending:"Chờ xử lý",st_progress:"Đang thực hiện",st_review:"Đang duyệt",st_approved:"Đã duyệt",st_delivered:"Đã bàn giao",
    pr_low:"Thấp",pr_medium:"Trung bình",pr_high:"Cao",pr_urgent:"Khẩn cấp",
    activeProjects:"Dự án đang hoạt động",inReview:"Đang duyệt",deliveredMonth:"Đã giao (tháng)",activeArtists:"Nghệ sĩ hoạt động",outstanding:"Còn phải thu",toPay:"Phải trả nghệ sĩ",
    needsReview:"Cần bạn duyệt",recentActivity:"Hoạt động dự án gần đây",activityCenter:"Trung tâm hoạt động",upcoming:"Bàn giao sắp tới",
    anonymous:"Ẩn danh",anonClient:"Khách hàng ẩn danh",anonArtist:"Nghệ sĩ ẩn danh",clientHidden:"danh tính nghệ sĩ được bảo vệ",artistHidden:"danh tính khách hàng được bảo vệ",fullMgmt:"quản lý toàn diện",
    kanban:"Kanban",list:"Danh sách",projectsCount:"dự án",
    tab_overview:"Tổng quan",tab_versions:"Phiên bản",tab_comments:"Bình luận",tab_files:"Tệp",tab_chat:"Trò chuyện",tab_songs:"Bài hát",tab_mou:"MOU",
    approve:"Phê duyệt",requestChanges:"Yêu cầu chỉnh sửa",reject:"Từ chối",uploadVersion:"Tải phiên bản",markDone:"Đánh dấu hoàn thành",approveDelivery:"Duyệt bàn giao",permissions:"Quyền",
    deliver:"Bàn giao",versions:"phiên bản",brief:"Brief dự án",timeline:"Dòng thời gian",completed:"hoàn thành",projectFolder:"Thư mục dự án đã đồng bộ",viewFiles:"Xem tất cả tệp",
    addComment:"Thêm bình luận theo dấu thời gian…",comment:"Bình luận",noComments:"Chưa có bình luận",latest:"Mới nhất",changesRequested:"Đã yêu cầu chỉnh sửa",
    moderatedChat:"Trò chuyện kiểm duyệt · danh tính được bảo vệ",chatNotice:"Cuộc trò chuyện này chỉ để thảo luận về dự án. Thông tin liên hệ và liên kết ngoài bị chặn tự động.",msgBlocked:"Tin nhắn bị chặn: có vẻ chứa thông tin liên hệ, liên kết hoặc mạng xã hội. Hãy giữ liên lạc trong dự án.",typeMsg:"Nhập tin nhắn về dự án…",
    driveTitle:"Google Drive",driveSub:"Một thư mục cho mỗi khách hàng · tự động cấu trúc, tự đặt tên",namingConvention:"Quy ước đặt tên",autoStructure:"Cấu trúc thư mục tự động",master:"Master",stems:"Stems",uploadFiles:"Tải tệp lên",dropHere:"Kéo tệp vào đây hoặc nhấp để tải lên — sẽ tự đổi tên",recentFiles:"Tệp gần đây",syncedDrive:"đã đồng bộ với Drive",openInDrive:"Mở trong Drive",
    songs:"Bài hát",song:"Bài hát",addSong:"Thêm bài hát",masterStems:"Giá Master & stems",perSong:"Mỗi bài",total:"Tổng",
    requestsTitle:"Yêu cầu dự án",newRequest:"Yêu cầu mới",requestSongs:"Bao nhiêu bài hát?",budget:"Ngân sách mong muốn",notes:"Ghi chú",submitRequest:"Gửi yêu cầu",approveReq:"Phê duyệt",negotiate:"Thương lượng",decline:"Từ chối",reqStatus_new:"Mới",reqStatus_negotiating:"Đang thương lượng",reqStatus_approved:"Đã duyệt",reqStatus_declined:"Đã từ chối",proposeRate:"Đề xuất giá",
    contractsTitle:"Hợp đồng & MOU",mou:"MOU",agreement:"Thỏa thuận",awaitingSig:"Chờ ký",signed:"Đã ký",signedByUs:"Đã ký bởi Ideal Music",signNow:"Ký ngay",sendContract:"Gửi hợp đồng",party_client:"Khách hàng",party_artist:"Nghệ sĩ",mouIntro:"Bản ghi nhớ này đã được Ideal Music ký trước và chỉ cần chữ ký của khách hàng để bắt đầu brief.",yourSignature:"Chữ ký của bạn",
    invoicesTitle:"Hóa đơn",generateInvoice:"Tạo hóa đơn",inv_draft:"Nháp",inv_sent:"Đã gửi",inv_partial:"Một phần",inv_paid:"Đã thanh toán",invNumber:"Hóa đơn #",issued:"Ngày phát hành",dueDate:"Hạn",billTo:"Gửi đến",amount:"Số tiền",subtotal:"Tạm tính",paid:"Đã trả",balance:"Còn lại",send:"Gửi",download:"Tải xuống",qty:"SL",rate:"Đơn giá",description:"Mô tả",
    paymentsTitle:"Thanh toán & pipeline",receivables:"Khoản phải thu (từ khách)",payouts:"Chi trả (cho nghệ sĩ)",financialPipeline:"Pipeline tài chính",whoToPay:"Ai cần được trả",payout_pending:"Chờ",payout_scheduled:"Đã lên lịch",payout_paid:"Đã trả",markPaid:"Đánh dấu đã trả",schedule:"Lên lịch",collected:"Đã thu",
    usersTitle:"Người dùng & quyền",inviteUser:"Mời người dùng",people:"Mọi người",permMatrix:"Ma trận quyền",permHint:"Nhấn từng mô-đun để nâng cấp: Xem → Bình luận → Duyệt → Sửa → Quản trị.",save:"Lưu",mod_projects:"Dự án",mod_files:"Tệp",mod_comments:"Bình luận",mod_chat:"Trò chuyện",mod_deliveries:"Bàn giao",mod_users:"Người dùng",mod_finance:"Tài chính",lvl_none:"Không truy cập",lvl_view:"Xem",lvl_comment:"Bình luận",lvl_approve:"Duyệt",lvl_edit:"Sửa",lvl_admin:"Quản trị",
    settingsTitle:"Cài đặt",language:"Ngôn ngữ",languageSub:"Tiếng Anh luôn là mặc định. Thay đổi bất cứ lúc nào.",companyInfo:"Thông tin công ty",companySub:"Dùng làm mặc định cho hóa đơn và MOU. Có thể chỉnh sửa.",appearance:"Giao diện",lightMode:"Sáng",darkMode:"Tối",legalName:"Tên pháp lý",address:"Địa chỉ",taxId:"Mã số thuế",email:"Email",signatory:"Người ký",currency:"Tiền tệ",saveChanges:"Lưu thay đổi",
    calTitle:"Lịch bàn giao",calSub:"Tháng 7 2026 · nhắc nhở tự động đang bật",cancel:"Hủy",create:"Tạo dự án",
    mouStep:"MOU",mouPending:"MOU đang chờ chữ ký của khách hàng",mouSignedMsg:"MOU đã ký — brief có thể tiếp tục",workflow:"Quy trình",
    title:"Tiêu đề",artistF:"Nghệ sĩ",clientF:"Khách hàng",priority:"Ưu tiên",deliveryDate:"Ngày bàn giao",progress:"Tiến độ",status:"Trạng thái",
    signInSub:"Dùng passkey để tiếp tục một cách an toàn.",passkeyBtn:"Đăng nhập bằng Passkey",faceTouch:"Face ID · Touch ID · khóa bảo mật",exploreDemo:"Khám phá bản demo không cần đăng nhập",verifying:"Đang xác minh…",authed:"Đã xác thực",welcome:"Chào mừng trở lại",chooseProfile:"Chọn hồ sơ để tiếp tục",endToEnd:"Riêng tư, ẩn danh & kiểm duyệt theo thiết kế",passkeyError:"Không thể xác minh passkey. Thử lại hoặc xem bản demo.",tryAgain:"Thử lại",orEmail:"hoặc",emailContinue:"Tiếp tục bằng email",emailPlaceholder:"ban@email.com",sendLink:"Gửi liên kết đăng nhập",checkEmail:"Kiểm tra email của bạn",checkEmailSub:"Chúng tôi đã gửi liên kết đăng nhập an toàn vào hộp thư của bạn. Mở trên thiết bị này để tiếp tục.",back:"Quay lại",
  },
  hi:{
    tagline:"संगीत निर्माण, सुंदरता से प्रबंधित।",pickRole:"डेमो में प्रवेश के लिए भूमिका चुनें · 100% गुमनाम और संचालित",
    role_admin:"प्रशासक",role_client:"ग्राहक",role_artist:"कलाकार",
    rd_admin:"पूर्ण नियंत्रण: परियोजनाएँ, उपयोगकर्ता, अनुमतियाँ, वित्त, डिलीवरी।",rd_client:"डेमो देखें, संस्करण स्वीकृत करें, MOU पर हस्ताक्षर करें और चालान चुकाएँ।",rd_artist:"ब्रीफ़ प्राप्त करें, मास्टर और स्टेम्स अपलोड करें, अपनी कमाई ट्रैक करें।",
    workspace:"वर्कस्पेस",portal:"ग्राहक पोर्टल",studio:"स्टूडियो",menu:"मेन्यू",quick:"त्वरित पहुँच",
    nav_dashboard:"डैशबोर्ड",nav_home:"होम",nav_projects:"परियोजनाएँ",nav_assigned:"सौंपी गई",nav_myprojects:"मेरी परियोजनाएँ",nav_requests:"अनुरोध",nav_contracts:"अनुबंध",nav_invoices:"चालान",nav_payments:"भुगतान",nav_earnings:"कमाई",nav_calendar:"कैलेंडर",nav_deliveries:"डिलीवरी",nav_drive:"ड्राइव",nav_files:"फ़ाइलें",nav_users:"उपयोगकर्ता",nav_settings:"सेटिंग्स",
    search:"सब कुछ खोजें…",searchHint:"परियोजनाएँ, क्रियाएँ खोजें…",notifications:"सूचनाएँ",markRead:"पढ़ा हुआ चिह्नित करें",signout:"साइन आउट",switchRole:"भूमिका बदलें: डेमो पुनः लोड करें",noResults:"कोई परिणाम नहीं",
    goodAfternoon:"शुभ अपराह्न",viewAll:"सभी देखें",newProject:"नई परियोजना",
    st_pending:"लंबित",st_progress:"प्रगति में",st_review:"समीक्षा में",st_approved:"स्वीकृत",st_delivered:"डिलीवर किया",
    pr_low:"निम्न",pr_medium:"मध्यम",pr_high:"उच्च",pr_urgent:"अत्यावश्यक",
    activeProjects:"सक्रिय परियोजनाएँ",inReview:"समीक्षा में",deliveredMonth:"डिलीवर (माह)",activeArtists:"सक्रिय कलाकार",outstanding:"बकाया",toPay:"कलाकारों को भुगतान",
    needsReview:"आपकी समीक्षा चाहिए",recentActivity:"हाल की परियोजना गतिविधि",activityCenter:"गतिविधि केंद्र",upcoming:"आगामी डिलीवरी",
    anonymous:"गुमनाम",anonClient:"गुमनाम ग्राहक",anonArtist:"गुमनाम कलाकार",clientHidden:"कलाकार की पहचान सुरक्षित",artistHidden:"ग्राहक की पहचान सुरक्षित",fullMgmt:"पूर्ण प्रबंधन",
    kanban:"कानबन",list:"सूची",projectsCount:"परियोजनाएँ",
    tab_overview:"अवलोकन",tab_versions:"संस्करण",tab_comments:"टिप्पणियाँ",tab_files:"फ़ाइलें",tab_chat:"चैट",tab_songs:"गाने",tab_mou:"MOU",
    approve:"स्वीकृत करें",requestChanges:"बदलाव का अनुरोध",reject:"अस्वीकार करें",uploadVersion:"संस्करण अपलोड करें",markDone:"पूर्ण चिह्नित करें",approveDelivery:"डिलीवरी स्वीकृत करें",permissions:"अनुमतियाँ",
    deliver:"डिलीवरी",versions:"संस्करण",brief:"परियोजना ब्रीफ़",timeline:"समयरेखा",completed:"पूर्ण",projectFolder:"परियोजना फ़ोल्डर सिंक किया गया",viewFiles:"सभी फ़ाइलें देखें",
    addComment:"टाइमस्टैम्प के साथ टिप्पणी जोड़ें…",comment:"टिप्पणी",noComments:"अभी तक कोई टिप्पणी नहीं",latest:"नवीनतम",changesRequested:"बदलाव का अनुरोध किया",
    moderatedChat:"संचालित चैट · पहचान सुरक्षित",chatNotice:"यह चैट केवल परियोजना पर चर्चा के लिए है। संपर्क विवरण और बाहरी लिंक स्वतः अवरुद्ध होते हैं।",msgBlocked:"संदेश अवरुद्ध: इसमें संपर्क विवरण, लिंक या सोशल मीडिया प्रतीत होता है। संचार परियोजना के भीतर रखें।",typeMsg:"परियोजना के बारे में संदेश लिखें…",
    driveTitle:"Google Drive",driveSub:"प्रति ग्राहक एक फ़ोल्डर · स्वतः संरचित, स्वतः नामित",namingConvention:"नामकरण परंपरा",autoStructure:"स्वतः फ़ोल्डर संरचना",master:"मास्टर",stems:"स्टेम्स",uploadFiles:"फ़ाइलें अपलोड करें",dropHere:"फ़ाइलें यहाँ खींचें या अपलोड के लिए क्लिक करें — स्वतः नाम बदलेगा",recentFiles:"हाल की फ़ाइलें",syncedDrive:"ड्राइव से सिंक",openInDrive:"ड्राइव में खोलें",
    songs:"गाने",song:"गाना",addSong:"गाना जोड़ें",masterStems:"मास्टर और स्टेम्स मूल्य",perSong:"प्रति गाना",total:"कुल",
    requestsTitle:"परियोजना अनुरोध",newRequest:"नया अनुरोध",requestSongs:"कितने गाने?",budget:"बजट प्राथमिकता",notes:"टिप्पणियाँ",submitRequest:"अनुरोध भेजें",approveReq:"स्वीकृत करें",negotiate:"मोलभाव करें",decline:"अस्वीकार करें",reqStatus_new:"नया",reqStatus_negotiating:"मोलभाव",reqStatus_approved:"स्वीकृत",reqStatus_declined:"अस्वीकृत",proposeRate:"दर प्रस्तावित करें",
    contractsTitle:"अनुबंध और MOU",mou:"MOU",agreement:"समझौता",awaitingSig:"हस्ताक्षर प्रतीक्षित",signed:"हस्ताक्षरित",signedByUs:"Ideal Music द्वारा हस्ताक्षरित",signNow:"अभी हस्ताक्षर करें",sendContract:"अनुबंध भेजें",party_client:"ग्राहक",party_artist:"कलाकार",mouIntro:"यह समझौता ज्ञापन Ideal Music द्वारा पूर्व-हस्ताक्षरित है और ब्रीफ़ शुरू करने के लिए केवल ग्राहक के हस्ताक्षर चाहिए।",yourSignature:"आपके हस्ताक्षर",
    invoicesTitle:"चालान",generateInvoice:"चालान बनाएँ",inv_draft:"मसौदा",inv_sent:"भेजा गया",inv_partial:"आंशिक",inv_paid:"भुगतान किया",invNumber:"चालान #",issued:"जारी",dueDate:"देय",billTo:"बिल प्राप्तकर्ता",amount:"राशि",subtotal:"उप-योग",paid:"भुगतान",balance:"शेष",send:"भेजें",download:"डाउनलोड",qty:"मात्रा",rate:"दर",description:"विवरण",
    paymentsTitle:"भुगतान और पाइपलाइन",receivables:"प्राप्य (ग्राहकों से)",payouts:"भुगतान (कलाकारों को)",financialPipeline:"वित्तीय पाइपलाइन",whoToPay:"किसे भुगतान करना है",payout_pending:"लंबित",payout_scheduled:"निर्धारित",payout_paid:"भुगतान किया",markPaid:"भुगतान चिह्नित करें",schedule:"निर्धारित करें",collected:"एकत्रित",
    usersTitle:"उपयोगकर्ता और अनुमतियाँ",inviteUser:"उपयोगकर्ता आमंत्रित करें",people:"लोग",permMatrix:"अनुमति मैट्रिक्स",permHint:"स्तर बढ़ाने के लिए प्रत्येक मॉड्यूल पर टैप करें: देखें → टिप्पणी → स्वीकृत → संपादन → व्यवस्थापक।",save:"सहेजें",mod_projects:"परियोजनाएँ",mod_files:"फ़ाइलें",mod_comments:"टिप्पणियाँ",mod_chat:"चैट",mod_deliveries:"डिलीवरी",mod_users:"उपयोगकर्ता",mod_finance:"वित्त",lvl_none:"पहुँच नहीं",lvl_view:"देखें",lvl_comment:"टिप्पणी",lvl_approve:"स्वीकृत",lvl_edit:"संपादन",lvl_admin:"व्यवस्थापक",
    settingsTitle:"सेटिंग्स",language:"भाषा",languageSub:"अंग्रेज़ी हमेशा डिफ़ॉल्ट है। कभी भी बदलें।",companyInfo:"कंपनी जानकारी",companySub:"चालान और MOU के लिए डिफ़ॉल्ट के रूप में उपयोग। संपादन योग्य।",appearance:"दिखावट",lightMode:"लाइट",darkMode:"डार्क",legalName:"कानूनी नाम",address:"पता",taxId:"कर / पंजीकरण आईडी",email:"ईमेल",signatory:"हस्ताक्षरकर्ता",currency:"मुद्रा",saveChanges:"परिवर्तन सहेजें",
    calTitle:"डिलीवरी कैलेंडर",calSub:"जुलाई 2026 · स्वचालित अनुस्मारक सक्रिय",cancel:"रद्द करें",create:"परियोजना बनाएँ",
    mouStep:"MOU",mouPending:"MOU ग्राहक के हस्ताक्षर की प्रतीक्षा में",mouSignedMsg:"MOU हस्ताक्षरित — ब्रीफ़ आगे बढ़ सकता है",workflow:"वर्कफ़्लो",
    title:"शीर्षक",artistF:"कलाकार",clientF:"ग्राहक",priority:"प्राथमिकता",deliveryDate:"डिलीवरी तिथि",progress:"प्रगति",status:"स्थिति",
    signInSub:"सुरक्षित रूप से जारी रखने के लिए अपना passkey उपयोग करें।",passkeyBtn:"Passkey से साइन इन करें",faceTouch:"Face ID · Touch ID · सुरक्षा कुंजी",exploreDemo:"बिना साइन इन किए डेमो देखें",verifying:"सत्यापित किया जा रहा है…",authed:"प्रमाणित",welcome:"वापसी पर स्वागत है",chooseProfile:"जारी रखने के लिए प्रोफ़ाइल चुनें",endToEnd:"निजी, गुमनाम और संचालित — डिज़ाइन से",passkeyError:"आपका passkey सत्यापित नहीं हो सका। पुनः प्रयास करें या डेमो देखें।",tryAgain:"पुनः प्रयास करें",orEmail:"या",emailContinue:"ईमेल से जारी रखें",emailPlaceholder:"aap@email.com",sendLink:"साइन-इन लिंक भेजें",checkEmail:"अपना ईमेल देखें",checkEmailSub:"हमने आपके इनबॉक्स में एक सुरक्षित साइन-इन लिंक भेजा है। जारी रखने के लिए इसे इसी डिवाइस पर खोलें।",back:"वापस",
  },
};
const LangCtx=createContext({lang:"en",t:(k)=>k});
const useT=()=>useContext(LangCtx);
function makeT(lang){return (k)=>{const s=STRINGS[lang]&&STRINGS[lang][k];return s!==undefined?s:(STRINGS.en[k]!==undefined?STRINGS.en[k]:k);};}
//SENTINEL_LIB
/* ===== DATA ===== */
const COMPANY={name:"Ideal Music LLC",address:"[Your company address]",taxId:"[Tax / Reg. ID]",email:"billing@ideal.music",signatory:"Donovan",currency:"USD",symbol:"$"};
const fmt=(n)=>"$"+Number(n).toLocaleString("en-US");
const gradients=["linear-gradient(135deg,#5e5ce6,#0a84ff)","linear-gradient(135deg,#ff2d55,#ff9f0a)","linear-gradient(135deg,#34c759,#0a84ff)","linear-gradient(135deg,#bf5af2,#ff2d55)","linear-gradient(135deg,#ff9f0a,#ff375f)","linear-gradient(135deg,#0a84ff,#5e5ce6)"];
const SC={pending:"#8e8e93",progress:"#0a84ff",review:"#ff9f0a",approved:"#34c759",delivered:"#5e5ce6"};
const SBG={pending:"rgba(142,142,147,.16)",progress:"rgba(10,132,255,.16)",review:"rgba(255,159,10,.16)",approved:"rgba(52,199,89,.16)",delivered:"rgba(94,92,230,.16)"};
const PC={low:"#8e8e93",medium:"#0a84ff",high:"#ff9f0a",urgent:"#ff3b30"};
function wf(seed){let a=[];let x=seed*9301;for(let i=0;i<54;i++){x=(x*9301+49297)%233280;a.push(0.18+Math.abs(Math.sin(i*0.5+seed))*0.55+(x/233280)*0.25);}return a;}

const CLIENTS=[
  {id:1,code:"LUNARECS",name:"Lunar Records",root:"Lunar Records",i:1},
  {id:2,code:"SUNSETCO",name:"Sunset Collective",root:"Sunset Collective",i:3},
  {id:3,code:"NEONLAB",name:"Neon Lab",root:"Neon Lab",i:4},
  {id:4,code:"VELVETCO",name:"Velvet Co.",root:"Velvet Co.",i:5},
];
// projects == briefs
const PROJECTS=[
  {id:1,title:"Midnight Bloom",sub:"Synth-pop",artist:"0xA4",artistName:"Nova Reyes",clientCode:"LUNARECS",clientName:"Lunar Records",status:"review",pri:"high",prog:75,grad:0,due:"Jul 4",seed:2,
    brief:"Atmospheric synth-pop, 110 BPM, A minor. References: nocturnal mood, warm analog synths, ethereal vocals with wide reverb.",
    pricing:{model:"persong",perSong:1200,total:1200,masterPrice:900,stemsPrice:300},
    mou:{signedByUs:true,signedByClient:true},
    songs:[{name:"Midnight Bloom",master:true,stems:true}],
    versions:[{v:"v3",label:"Revised mix",date:"Jun 28",size:"48 MB",status:"review"},{v:"v2",label:"Structure + vocals",date:"Jun 22",size:"44 MB",status:"changes"},{v:"v1",label:"Initial demo",date:"Jun 15",size:"39 MB",status:"approved"}],
    comments:[{who:"client",ts:"0:42",text:"Love the drop here. Could we push the synth up a touch?",time:"2h ago"},{who:"artist",ts:"1:18",text:"Adjusted in v3. Also cleaned the low end.",time:"1h ago"}],
    files:["Master_v3.wav","Stems_v3.zip","Instrumental.wav","Brief.pdf","Ref_moodboard.png"]},
  {id:2,title:"Golden Hour",sub:"Lo-fi house · EP",artist:"0xB7",artistName:"Theo Park",clientCode:"SUNSETCO",clientName:"Sunset Collective",status:"progress",pri:"medium",prog:45,grad:1,due:"Jul 12",seed:5,
    brief:"3-track lo-fi house EP, warm, vinyl. 120 BPM. Sunset feel, analog textures.",
    pricing:{model:"total",perSong:1000,total:2800,masterPrice:2200,stemsPrice:600},
    mou:{signedByUs:true,signedByClient:true},
    songs:[{name:"Sunset Drive",master:true,stems:true},{name:"Amber",master:true,stems:false},{name:"Dusk",master:true,stems:true}],
    versions:[{v:"v2",label:"Track 1 + 2 WIP",date:"Jun 26",size:"62 MB",status:"progress"},{v:"v1",label:"Sketches",date:"Jun 18",size:"51 MB",status:"approved"}],
    comments:[{who:"client",ts:"0:30",text:"The groove on track 1 is perfect. Keep going.",time:"1d ago"}],
    files:["Track1_v2.wav","Track2_v2.wav","Stems.zip","Brief.pdf"]},
  {id:3,title:"Neon Tokyo",sub:"Future bass",artist:"0xC2",artistName:"Mika Sol",clientCode:"NEONLAB",clientName:"Neon Lab",status:"approved",pri:"high",prog:100,grad:3,due:"Jun 25",seed:8,
    brief:"Energetic future bass, big drops, vocal chops. 150 BPM. Cyberpunk aesthetic.",
    pricing:{model:"persong",perSong:1500,total:1500,masterPrice:1100,stemsPrice:400},
    mou:{signedByUs:true,signedByClient:true},
    songs:[{name:"Neon Tokyo",master:true,stems:true}],
    versions:[{v:"v4",label:"Final master",date:"Jun 24",size:"55 MB",status:"approved"},{v:"v3",label:"Pre-master",date:"Jun 20",size:"54 MB",status:"approved"}],
    comments:[{who:"client",ts:"1:02",text:"Approved! Sounds incredible, exactly what we wanted.",time:"5d ago"}],
    files:["Master_FINAL.wav","Stems_v4.zip","Instrumental.wav","Acapella.wav","Brief.pdf"]},
  {id:4,title:"Velvet Skies",sub:"R&B",artist:"0xD9",artistName:"Aria Lune",clientCode:"VELVETCO",clientName:"Velvet Co.",status:"pending",pri:"urgent",prog:10,grad:4,due:"Jul 2",seed:11,
    brief:"Sensual, warm R&B, 90 BPM. Prominent bass, soft percussion, room for lead vocal.",
    pricing:{model:"persong",perSong:1300,total:1300,masterPrice:1000,stemsPrice:300},
    mou:{signedByUs:true,signedByClient:false},
    songs:[{name:"Velvet Skies",master:true,stems:false}],
    versions:[{v:"v1",label:"Initial sketch",date:"Jun 29",size:"40 MB",status:"review"}],
    comments:[],
    files:["Sketch_v1.wav","Brief.pdf","Ref_track.mp3"]},
  {id:5,title:"Aurora Drift",sub:"Ambient",artist:"0xA4",artistName:"Nova Reyes",clientCode:"SUNSETCO",clientName:"Sunset Collective",status:"delivered",pri:"low",prog:100,grad:5,due:"Jun 10",seed:14,
    brief:"Cinematic ambient, no percussion, evolving pads. For A/V sync.",
    pricing:{model:"total",perSong:1800,total:1800,masterPrice:1800,stemsPrice:0},
    mou:{signedByUs:true,signedByClient:true},
    songs:[{name:"Aurora Drift",master:true,stems:false}],
    versions:[{v:"v2",label:"Final delivery",date:"Jun 9",size:"71 MB",status:"approved"}],
    comments:[{who:"client",ts:"2:10",text:"Delivered and licensed. Thanks for the work.",time:"3w ago"}],
    files:["Master.wav","Stems.zip","Brief.pdf"]},
];
const REQUESTS=[
  {id:1,clientCode:"LUNARECS",clientName:"Lunar Records",songs:3,budgetType:"persong",notes:"Dream-pop EP, cohesive mood, female vocal toplines.",status:"new",proposedPerSong:0,proposedTotal:0,time:"3h ago"},
  {id:2,clientCode:"NEONLAB",clientName:"Neon Lab",songs:1,budgetType:"total",notes:"Single for a game trailer, aggressive, 160 BPM.",status:"negotiating",proposedPerSong:0,proposedTotal:1800,time:"1d ago"},
  {id:3,clientCode:"VELVETCO",clientName:"Velvet Co.",songs:2,budgetType:"persong",notes:"Two soulful R&B cuts.",status:"approved",proposedPerSong:1300,proposedTotal:2600,time:"4d ago"},
];
const INVOICES=[
  {id:1,number:"IM-2026-0042",clientName:"Lunar Records",project:"Midnight Bloom",status:"sent",issued:"Jun 28",due:"Jul 12",paid:0,
    items:[{desc:"Midnight Bloom — Master",qty:1,rate:900},{desc:"Midnight Bloom — Stems",qty:1,rate:300}]},
  {id:2,number:"IM-2026-0039",clientName:"Neon Lab",project:"Neon Tokyo",status:"paid",issued:"Jun 18",due:"Jun 30",paid:1500,
    items:[{desc:"Neon Tokyo — Master",qty:1,rate:1100},{desc:"Neon Tokyo — Stems",qty:1,rate:400}]},
  {id:3,number:"IM-2026-0044",clientName:"Sunset Collective",project:"Golden Hour",status:"partial",issued:"Jun 26",due:"Jul 20",paid:1400,
    items:[{desc:"Golden Hour EP — Masters (3)",qty:3,rate:700},{desc:"Golden Hour EP — Stems (2)",qty:2,rate:350}]},
  {id:4,number:"IM-2026-0031",clientName:"Sunset Collective",project:"Aurora Drift",status:"paid",issued:"Jun 5",due:"Jun 19",paid:1800,
    items:[{desc:"Aurora Drift — Master",qty:1,rate:1800}]},
];
const PAYOUTS=[
  {artist:"Nova Reyes",i:0,project:"Midnight Bloom",amount:720,status:"pending"},
  {artist:"Theo Park",i:2,project:"Golden Hour",amount:980,status:"scheduled"},
  {artist:"Mika Sol",i:4,project:"Neon Tokyo",amount:900,status:"paid"},
  {artist:"Nova Reyes",i:0,project:"Aurora Drift",amount:1080,status:"paid"},
];
const CONTRACTS=[
  {id:1,type:"MOU",party:"client",projectId:4,name:"Velvet Skies",clientName:"Velvet Co.",status:"awaiting"},
  {id:2,type:"MOU",party:"client",projectId:1,name:"Midnight Bloom",clientName:"Lunar Records",status:"signed"},
  {id:3,type:"Agreement",party:"artist",projectId:1,name:"Midnight Bloom",artistName:"Nova Reyes",status:"signed"},
  {id:4,type:"MOU",party:"client",projectId:2,name:"Golden Hour",clientName:"Sunset Collective",status:"signed"},
];
const ACTIVITY=[
  {icon:"up",color:"#0a84ff",text:"Nova uploaded v3 of Midnight Bloom",time:"1h ago"},
  {icon:"chat",color:"#5e5ce6",text:"New comment on Golden Hour",time:"3h ago"},
  {icon:"check",color:"#34c759",text:"Neon Tokyo was approved by the client",time:"5h ago"},
  {icon:"receipt",color:"#30b0c7",text:"Invoice IM-2026-0042 sent to Lunar Records",time:"6h ago"},
  {icon:"contract",color:"#ff9f0a",text:"MOU awaiting signature · Velvet Skies",time:"1d ago"},
];
const NOTIFS=[
  {text:"Client requested changes on Midnight Bloom (v3)",time:"12 min ago",unread:true},
  {text:"New project request from Lunar Records (3 songs)",time:"3h ago",unread:true},
  {text:"Invoice IM-2026-0044 partially paid ($1,400)",time:"5h ago",unread:true},
  {text:"Neon Tokyo approved — ready for delivery",time:"5h ago",unread:false},
];
const PROFILES={admin:{name:"Donovan",i:5},client:{name:"Lunar Records",i:1},artist:{name:"Nova Reyes",i:0}};
//SENTINEL_DATA
/* ===== small components ===== */
const Pill=({s})=>{const{t}=useT();return <span className="pill" style={{color:SC[s],background:SBG[s]}}><span className="pdot" style={{background:SC[s]}}/>{t('st_'+s)}</span>;};
const Pri=({p})=>{const{t}=useT();return <span className="pri" style={{color:PC[p],background:PC[p]+'22'}}>{t('pr_'+p)}</span>;};
const Avatar=({name,i=0,size=34})=>{const init=(name||'?').split(' ').map(s=>s[0]).slice(0,2).join('');return <div className="avatar" style={{background:gradients[i%6],width:size,height:size,flex:`0 0 ${size}px`,fontSize:size*0.38}}>{init}</div>;};
function Cover({grad,height=80}){return <div className="cover" style={{background:gradients[grad],height}}><div className="play"><span><I.play style={{width:14,height:14,color:'#fff',marginLeft:2}}/></span></div></div>;}
function Waveform({seed,progress,markers=[],onSeek}){const bars=useMemo(()=>wf(seed),[seed]);return <div className="wave" onClick={(e)=>{const r=e.currentTarget.getBoundingClientRect();onSeek&&onSeek((e.clientX-r.left)/r.width);}}>{bars.map((h,i)=>{const pos=i/bars.length;const played=pos<=progress;const isMarker=markers.some(m=>Math.abs(m-pos)<0.012);return <div key={i} className={"bar"+(played?" played":"")+(isMarker?" marker":"")} style={{height:`${h*100}%`}}/>;})}</div>;}
function Ring({pct,size=44,color="#0a84ff"}){const r=(size-5)/2,c=2*Math.PI*r;return <svg className="ring" width={size} height={size}><circle cx={size/2} cy={size/2} r={r} stroke="var(--sep)"/><circle cx={size/2} cy={size/2} r={r} stroke={color} strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} style={{transition:'stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)'}}/></svg>;}
const who=(p,role,t)=>role==='admin'?p.artistName:role==='artist'?t('anonClient'):t('anonArtist');
const myProjects=(role)=>role==='admin'?PROJECTS:role==='client'?PROJECTS.filter(p=>['LUNARECS','SUNSETCO'].includes(p.clientCode)):PROJECTS.filter(p=>p.artistName==='Nova Reyes');

/* ===== LOGIN ===== */
/* ===== LOGIN CONFIG (super admin customizable) ===== */
const LOGIN_DEFAULT={bg:'gradient',gFrom:'#5e5ce6',gVia:'#0a84ff',gTo:'#ff2d55',mediaUrl:'',loop:true,fit:'cover',ov:{particles:true,grain:true,lights:true,animGradient:true,blur:false},intensity:55,speed:50,opacity:100};
function readLoginConfig(){try{const s=localStorage.getItem('im_login_config');if(s){const p=JSON.parse(s);return Object.assign({},LOGIN_DEFAULT,p,{ov:Object.assign({},LOGIN_DEFAULT.ov,p.ov||{})});}}catch(_){}return JSON.parse(JSON.stringify(LOGIN_DEFAULT));}
function writeLoginConfig(c){try{localStorage.setItem('im_login_config',JSON.stringify(c));}catch(_){}}
function LoginPreview({cfg}){
  return <div className="login lp-preview">
    <LoginBackdrop cfg={cfg}/>
    <div className="signwrap" style={{transform:'scale(.8)'}}>
      <div className="signcard" style={{width:300}}>
        <div className="brandmark" style={{width:56,height:56,borderRadius:16}}><img src="/logo-white.png" alt="" style={{width:'64%',height:'64%',objectFit:'contain'}}/></div>
        <h1 style={{fontSize:22,marginTop:16}}>Ideal Music</h1>
        <p className="sub" style={{fontSize:12}}>Use your passkey to continue securely.</p>
        <div className="passkey-btn" style={{marginTop:14,pointerEvents:'none'}}>Sign in with Passkey</div>
      </div>
    </div>
  </div>;
}
const OV_LIST=[['particles','Particles'],['grain','Grain'],['lights','Lights'],['animGradient','Animated gradient'],['blur','Blur']];
function LoginCustomizer({toast}){
  const{t}=useT();const[cfg,setCfg]=useState(readLoginConfig);
  const set=(k,v)=>setCfg(c=>Object.assign({},c,{[k]:v}));
  const setOv=(k,v)=>setCfg(c=>Object.assign({},c,{ov:Object.assign({},c.ov,{[k]:v})}));
  const onFile=(e,kind)=>{const f=e.target.files&&e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);setCfg(c=>Object.assign({},c,{bg:kind,mediaUrl:url}));};
  const save=()=>{writeLoginConfig(cfg);toast('✓ '+t('loginSaved'));};
  const reset=()=>{const d=JSON.parse(JSON.stringify(LOGIN_DEFAULT));setCfg(d);writeLoginConfig(d);toast(t('loginReset'));};
  const BG=[['gradient','Default'],['customGradient','Custom gradient'],['image','Image'],['video','Video']];
  return <div className="card solid" style={{padding:'22px 24px',marginBottom:18}}>
    <b style={{fontSize:16,display:'flex',alignItems:'center',gap:9}}><I.bolt style={{width:18,height:18,color:'var(--accent)'}}/>{t('loginScreen')}<span className="super-badge">Super Admin</span></b>
    <p style={{fontSize:13,color:'var(--text-2)',margin:'4px 0 16px'}}>{t('loginScreenSub')}</p>
    <div className="lc-grid">
      <div className="lc-controls">
        <div className="lc-label">{t('background')}</div>
        <div className="seg lc-seg">{BG.map(([k,l])=><button key={k} className={cfg.bg===k?'on':''} onClick={()=>set('bg',k)}>{l}</button>)}</div>
        {cfg.bg==='customGradient'?<div className="lc-row">
          <label className="lc-color"><span>From</span><input type="color" value={cfg.gFrom} onChange={e=>set('gFrom',e.target.value)}/></label>
          <label className="lc-color"><span>Via</span><input type="color" value={cfg.gVia} onChange={e=>set('gVia',e.target.value)}/></label>
          <label className="lc-color"><span>To</span><input type="color" value={cfg.gTo} onChange={e=>set('gTo',e.target.value)}/></label>
        </div>:null}
        {(cfg.bg==='image'||cfg.bg==='video')?<div>
          <div className="field"><label>{t('mediaUrl')}</label><input value={cfg.mediaUrl} placeholder="https://…" onChange={e=>set('mediaUrl',e.target.value)}/></div>
          <label className="lc-upload"><input type="file" accept={cfg.bg==='video'?'video/*':'image/*'} onChange={e=>onFile(e,cfg.bg)} style={{display:'none'}}/><I.cloud style={{width:16,height:16}}/>{t('uploadFile')}</label>
          <div className="lc-row" style={{marginTop:10}}>
            <label className="lc-mini"><span>{t('fit')}</span><select value={cfg.fit} onChange={e=>set('fit',e.target.value)}><option value="cover">Cover</option><option value="contain">Contain</option></select></label>
            {cfg.bg==='video'?<label className="lc-toggle"><input type="checkbox" checked={cfg.loop} onChange={e=>set('loop',e.target.checked)}/>{t('loop')}</label>:null}
          </div>
        </div>:null}
        <div className="lc-label" style={{marginTop:16}}>{t('overlay')}</div>
        <div className="lc-chips">{OV_LIST.map(([k,l])=><button key={k} className={"lc-chip"+(cfg.ov[k]?' on':'')} onClick={()=>setOv(k,!cfg.ov[k])}>{cfg.ov[k]?<I.check style={{width:13,height:13}}/>:null}{l}</button>)}</div>
        <div className="lc-slider"><label>{t('intensity')}<b>{cfg.intensity}%</b></label><input type="range" min="0" max="100" value={cfg.intensity} onChange={e=>set('intensity',+e.target.value)}/></div>
        <div className="lc-slider"><label>{t('speed')}<b>{cfg.speed}%</b></label><input type="range" min="0" max="100" value={cfg.speed} onChange={e=>set('speed',+e.target.value)}/></div>
        <div className="lc-slider"><label>{t('opacityL')}<b>{cfg.opacity}%</b></label><input type="range" min="0" max="100" value={cfg.opacity} onChange={e=>set('opacity',+e.target.value)}/></div>
        <div style={{display:'flex',gap:10,marginTop:18}}><button className="btn" onClick={save}><I.check style={{width:15,height:15}}/>{t('saveChanges')}</button><button className="btn ghost" onClick={reset}>{t('resetDefault')}</button></div>
      </div>
      <div className="lc-preview-wrap"><div className="lc-preview-label">{t('livePreview')}</div><div className="lc-preview"><LoginPreview cfg={cfg}/></div></div>
    </div>
  </div>;
}

function Login({onPick,lang,setLang}){
  const{t}=useT();
  const cfg=useMemo(()=>readLoginConfig(),[]);
  const [stage,setStage]=useState('signin'); // signin | verifying | done | role
  const roles=[{id:"admin",icon:"🛠",color:"linear-gradient(135deg,#5e5ce6,#0a84ff)"},{id:"client",icon:"🎧",color:"linear-gradient(135deg,#ff2d55,#ff9f0a)"},{id:"artist",icon:"🎹",color:"linear-gradient(135deg,#34c759,#0a84ff)"},{id:"superadmin",icon:"⚡",color:"linear-gradient(135deg,#1d1d1f,#5e5ce6)"}];
  const FaceID=(p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"/><path d="M9 10v1.6M15 10v1.6M12 9.4v3.6l-1.3 .8"/><path d="M9.2 15.1c.85.75 1.85 1.05 2.8 1.05s1.95-.3 2.8-1.05"/></svg>;
  async function passkey(){
    setStage('verifying');
    const rpId=location.hostname;
    const enc=(buf)=>btoa(String.fromCharCode.apply(null,new Uint8Array(buf)));
    const dec=(s)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
    try{
      if(!(window.PublicKeyCredential&&navigator.credentials)) throw new Error('unsupported');
      const key='im_passkey_'+rpId;
      let stored=null; try{stored=localStorage.getItem(key);}catch(_){}
      if(stored){ // authenticate with the registered passkey (Touch ID / Face ID)
        await navigator.credentials.get({publicKey:{
          challenge:crypto.getRandomValues(new Uint8Array(32)),timeout:60000,rpId,
          userVerification:'required',allowCredentials:[{type:'public-key',id:dec(stored)}]}});
      }else{ // first time: register a passkey on this device
        const cred=await navigator.credentials.create({publicKey:{
          challenge:crypto.getRandomValues(new Uint8Array(32)),
          rp:{name:'Ideal Music',id:rpId},
          user:{id:crypto.getRandomValues(new Uint8Array(16)),name:'donovan@ideal-music.net',displayName:'Ideal Music'},
          pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
          authenticatorSelection:{userVerification:'required',residentKey:'preferred'},
          timeout:60000,attestation:'none'}});
        try{localStorage.setItem(key,enc(cred.rawId));}catch(_){}
      }
      setStage('done');
      setTimeout(()=>setStage('role'),750);
    }catch(e){ setStage('error'); }
  }
  const [email,setEmail]=useState('');
  const [busy,setBusy]=useState(false);
  const [emailErr,setEmailErr]=useState('');
  async function sendMagic(){
    if(!email.trim()||!supa)return;
    setBusy(true);setEmailErr('');
    try{
      const {error}=await supa.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:location.origin}});
      if(error)throw error;
      setStage('sent');
    }catch(e){ setEmailErr(e.message||'Could not send the link.'); }
    setBusy(false);
  }
  return <div className="login">
    <LoginBackdrop cfg={cfg}/>
    <div className="signwrap">
      <div className="signcard">
        <div className="brandmark"><img src="/logo-white.png" alt="Ideal Music" style={{width:'64%',height:'64%',objectFit:'contain'}}/></div>
        {stage!=='role'
          ? <><h1>Ideal Music</h1><p className="sub">{t('signInSub')}</p></>
          : <><h1>{t('welcome')}</h1><p className="sub">{t('chooseProfile')}</p></>}
        {stage==='signin'&&<div style={{animation:'fadeUp .4s both'}}>
          <button className="passkey-btn" onClick={passkey}><FaceID style={{width:21,height:21}}/>{t('passkeyBtn')}</button>
          <div className="passkey-meta"><I.lock style={{width:13,height:13}}/>{t('faceTouch')}</div>
          <div className="auth-or"><span>{t('orEmail')}</span></div>
          <button className="email-btn" onClick={()=>setStage('email')}><I.chat style={{width:16,height:16}}/>{t('emailContinue')}</button>
          <button className="ghost-link" onClick={()=>setStage('role')}>{t('exploreDemo')}</button>
        </div>}
        {stage==='email'&&<div style={{animation:'fadeUp .35s both'}}>
          <input className="email-input" type="email" autoFocus placeholder={t('emailPlaceholder')} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMagic()}/>
          {emailErr&&<div style={{color:'var(--red)',fontSize:12.5,marginTop:8,lineHeight:1.4}}>{emailErr}</div>}
          <button className="passkey-btn" style={{marginTop:12,background:'var(--accent)'}} disabled={busy} onClick={sendMagic}>{busy?t('verifying'):t('sendLink')}</button>
          <button className="ghost-link" onClick={()=>setStage('signin')}>← {t('back')}</button>
        </div>}
        {stage==='sent'&&<div className="verifying"><div className="success-check" style={{background:'var(--accent)',boxShadow:'0 8px 22px rgba(10,132,255,.4)'}}><I.send style={{width:23,height:23,color:'#fff'}}/></div><div style={{fontSize:15,fontWeight:600}}>{t('checkEmail')}</div><div style={{fontSize:13,color:'var(--text-2)',maxWidth:300,textAlign:'center',lineHeight:1.5}}>{t('checkEmailSub')}</div></div>}
        {stage==='verifying'&&<div className="verifying"><div className="spinner"/><div style={{fontSize:14,color:'var(--text-2)',fontWeight:540}}>{t('verifying')}</div></div>}
        {stage==='done'&&<div className="verifying"><div className="success-check"><I.check style={{width:26,height:26,color:'#fff'}}/></div><div style={{fontSize:14,color:'var(--text-2)',fontWeight:540}}>{t('authed')}</div></div>}
        {stage==='error'&&<div style={{animation:'fadeUp .35s both'}}>
          <div className="verifying" style={{paddingBottom:2}}><div className="err-badge"><I.lock style={{width:22,height:22,color:'#fff'}}/></div><div style={{fontSize:13.5,color:'var(--text-2)',fontWeight:520,maxWidth:300,lineHeight:1.45}}>{t('passkeyError')}</div></div>
          <button className="passkey-btn" onClick={passkey} style={{marginTop:10}}><FaceID style={{width:21,height:21}}/>{t('tryAgain')}</button>
          <button className="ghost-link" onClick={()=>setStage('role')}>{t('exploreDemo')}</button>
        </div>}
        {stage==='role'&&<div className="role-list">
          {roles.map(r=><button key={r.id} className="role-row" onClick={()=>onPick(r.id)}>
            <div className="ricon" style={{background:r.color}}>{r.icon}</div>
            <div style={{minWidth:0}}><b>{t('role_'+r.id)}</b><small>{t('rd_'+r.id)}</small></div>
            <I.chevR className="chev" style={{width:18,height:18}}/>
          </button>)}
        </div>}
        <div className="langpick">{LANGS.map(l=><button key={l.c} className={lang===l.c?'on':''} onClick={()=>setLang(l.c)}><span style={{fontSize:15}}>{l.flag}</span>{l.native}</button>)}</div>
      </div>
      <p className="login-foot"><I.shield style={{width:13,height:13}}/>{t('endToEnd')}</p>
    </div>
  </div>;
}

/* ===== DASHBOARD ===== */
const RS_NEEDS=['new_version','submitted','in_review','pending','draft'];
function ClientHome({name,go}){
  const{t}=useT();
  const [items,setItems]=useState(null);
  useEffect(()=>{ (async()=>{ try{ const j=await rv('listMine'); setItems(j.items||[]); }catch(e){ setItems([]); } })(); },[]);
  const outAmt=INVOICES.filter(i=>i.clientName==='Lunar Records').reduce((a,i)=>a+(i.items.reduce((x,it)=>x+it.qty*it.rate,0)-i.paid),0);
  const all=items||[];
  const needs=all.filter(it=>RS_NEEDS.indexOf(it.status)>=0);
  const projMap={}; all.forEach(it=>{ const k=it.project_id; if(!projMap[k])projMap[k]={id:k,title:it.project_title,items:[]}; projMap[k].items.push(it); });
  const projects=Object.keys(projMap).map(k=>projMap[k]);
  const openReview=(it)=>go('review',it);
  const sk=(i)=><div key={i} className="rs-sk" style={{height:56,marginTop:9,borderRadius:12}}/>;
  const emptyBox=(icon,title,sub)=><div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'34px 12px',textAlign:'center'}}>{icon}<div style={{fontSize:13.5,fontWeight:600,marginTop:10}}>{title}</div><div style={{fontSize:12.5,color:'var(--text-3)',marginTop:2,maxWidth:220,lineHeight:1.45}}>{sub}</div></div>;
  const header=(title,count,onView)=><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4,minHeight:30}}>
    <b style={{fontSize:16,letterSpacing:'-.01em'}}>{title}{count!=null&&<span style={{fontSize:13.5,color:'var(--text-3)',fontWeight:500,marginLeft:8}}>{count}</span>}</b>
    {onView&&<button className="btn ghost sm" onClick={onView}>{t('viewAll')}</button>}</div>;
  const row=(key,grad,icon,titleTx,subTx,right,onClick,idx)=><button key={key} onClick={onClick} style={{display:'flex',alignItems:'center',gap:13,padding:'12px 8px',borderTop:idx?'1px solid var(--sep)':'none',width:'100%',textAlign:'left',borderRadius:10,transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='var(--sep)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
    <div style={{width:42,height:42,borderRadius:11,background:grad,flex:'0 0 42px',display:'flex',alignItems:'center',justifyContent:'center'}}>{icon}</div>
    <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{titleTx}</div><div style={{fontSize:12.5,color:'var(--text-3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{subTx}</div></div>
    {right}</button>;
  return <div className="view content narrow">
    <div className="h-row"><div>
      <h1>{t('goodAfternoon')}, {name}</h1>
      <p>The latest across all your projects — always up to date, in one place.</p>
    </div></div>
    {outAmt>0&&<button className="card solid" onClick={()=>go('invoices')} style={{display:'flex',alignItems:'center',gap:14,padding:'15px 20px',marginBottom:16,width:'100%',textAlign:'left',border:'1px solid rgba(255,159,10,.35)',background:'linear-gradient(90deg,rgba(255,159,10,.09),transparent 70%)'}}>
      <span style={{width:44,height:44,borderRadius:12,background:'rgba(255,159,10,.16)',color:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 44px'}}><I.receipt style={{width:20,height:20}}/></span>
      <div style={{flex:1}}><div style={{fontSize:12,color:'var(--text-3)',fontWeight:560,textTransform:'uppercase',letterSpacing:'.03em'}}>Outstanding balance</div><div style={{fontSize:22,fontWeight:680,letterSpacing:'-.02em'}}>{fmt(outAmt)}</div></div>
      <span className="btn sm" style={{background:'var(--orange)',boxShadow:'0 4px 14px rgba(255,159,10,.3)'}}>View invoices</span></button>}
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'stretch'}}>
      <div className="card solid view" style={{padding:'18px 20px',display:'flex',flexDirection:'column'}}>
        {header(t('nav_myprojects'),items?projects.length:null,()=>go('projects'))}
        {items===null?[0,1,2].map(sk)
        :projects.length===0?emptyBox(<I.folder style={{width:26,height:26,color:'var(--text-3)'}}/>,'No projects yet','New projects will appear here as soon as they start.')
        :<div className="stagger" style={{flex:1}}>{projects.map((p,i)=>{ const pn=p.items.filter(x=>RS_NEEDS.indexOf(x.status)>=0).length;
          return row(p.id,gradients[i%6],<I.note style={{width:18,height:18,color:'#fff'}}/>,p.title,p.items.length+' '+(p.items.length===1?'song':'songs'),pn>0?<span className="rs-badge" style={{background:'rgba(255,159,10,.16)',color:'var(--orange)'}}>{pn} to review</span>:<I.check style={{width:17,height:17,color:'var(--green)'}}/>,()=>openReview(p.items[0]),i); })}</div>}
      </div>
      <div className="card solid view" style={{padding:'18px 20px',display:'flex',flexDirection:'column'}}>
        {header('Needs your review',items?needs.length:null,null)}
        {items===null?[0,1,2].map(sk)
        :needs.length===0?emptyBox(<div style={{width:44,height:44,borderRadius:'50%',background:'rgba(52,199,89,.14)',display:'flex',alignItems:'center',justifyContent:'center'}}><I.check style={{width:22,height:22,color:'var(--green)'}}/></div>,"You're all caught up",'No demos are waiting for your review.')
        :<div className="stagger" style={{flex:1}}>{needs.map((it,i)=>row(it.submission_id,'linear-gradient(135deg,rgba(255,159,10,.92),rgba(255,59,48,.85))',<I.play style={{width:16,height:16,color:'#fff',marginLeft:2}}/>,it.project_title,(it.current_filename||('Version '+it.current_version_no))+' · '+rsDate(it.current_submitted_at),<I.arrow style={{width:16,height:16,color:'var(--text-3)',flex:'0 0 16px'}}/>,()=>openReview(it),i))}</div>}
      </div>
    </div>
    <div className="card solid" style={{padding:'18px 20px',marginTop:16}}>
      <b style={{fontSize:15,display:'flex',alignItems:'center',gap:8}}><I.activity style={{width:16,height:16,color:'var(--accent-2)'}}/>{t('activityCenter')}</b>
      <div style={{marginTop:6}}>{ACTIVITY.slice(0,3).map((a,i)=><div key={i} style={{display:'flex',gap:11,padding:'10px 0',borderTop:i?'1px solid var(--sep)':'none'}}>
        <span style={{width:30,height:30,borderRadius:9,background:a.color+'22',color:a.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 30px'}}>{I[a.icon]({style:{width:15,height:15}})}</span>
        <div><div style={{fontSize:13,lineHeight:1.35}}>{a.text}</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>{a.time}</div></div></div>)}</div>
    </div>
  </div>;
}
function Dashboard({role,go,name}){
  if(role==='client')return <ClientHome name={name} go={go}/>;
  const{t}=useT();const visible=myProjects(role);
  const outstanding=INVOICES.reduce((a,i)=>a+(i.items.reduce((x,it)=>x+it.qty*it.rate,0)-i.paid),0);
  const toPay=PAYOUTS.filter(p=>p.status!=='paid').reduce((a,p)=>a+p.amount,0);
  const stats=role==='admin'
    ?[{l:t('activeProjects'),v:PROJECTS.filter(p=>p.status!=='delivered').length,d:"+2",up:1,ic:"folder",c:"#0a84ff"},
      {l:t('inReview'),v:PROJECTS.filter(p=>p.status==='review').length,d:t('st_review'),up:0,ic:"clock",c:"#ff9f0a"},
      {l:t('outstanding'),v:fmt(outstanding),d:t('receivables'),up:0,ic:"receipt",c:"#30b0c7"},
      {l:t('toPay'),v:fmt(toPay),d:t('payouts'),up:0,ic:"dollar",c:"#5e5ce6"}]
    :role==='client'
    ?[{l:t('nav_myprojects'),v:visible.length,d:"",up:1,ic:"folder",c:"#0a84ff"},
      {l:t('needsReview'),v:visible.filter(p=>p.status==='review').length,d:"",up:0,ic:"clock",c:"#ff9f0a"},
      {l:t('outstanding'),v:fmt(INVOICES.filter(i=>i.clientName==='Lunar Records').reduce((a,i)=>a+(i.items.reduce((x,it)=>x+it.qty*it.rate,0)-i.paid),0)),d:t('nav_invoices'),up:0,ic:"receipt",c:"#30b0c7"}]
    :[{l:t('nav_assigned'),v:visible.length,d:"",up:1,ic:"folder",c:"#0a84ff"},
      {l:t('changesRequested'),v:1,d:"",up:0,ic:"bolt",c:"#ff9f0a"},
      {l:t('nav_earnings'),v:fmt(PAYOUTS.filter(p=>p.artist==='Nova Reyes'&&p.status!=='paid').reduce((a,p)=>a+p.amount,0)),d:t('payout_pending'),up:0,ic:"dollar",c:"#34c759"}];
  return <div className="view content narrow">
    <div className="h-row"><div>
      <h1>{t('goodAfternoon')}, {name}</h1>
      <p>{role==='admin'?'Ideal Music overview.':role==='client'?'Your projects. All anonymous & secure.':'Your assigned projects and upcoming deliveries.'}</p>
    </div>{role==='admin'&&<button className="btn" onClick={()=>go('new')}><I.plus style={{width:16,height:16}}/>{t('newProject')}</button>}</div>
    <div className="grid stagger" style={{gridTemplateColumns:`repeat(${stats.length},1fr)`,marginBottom:24}}>
      {stats.map((s,i)=><div className="card stat" key={i}>
        <div className="lab"><span className="si" style={{background:s.c+'22',color:s.c}}>{I[s.ic]({style:{width:15,height:15}})}</span>{s.l}</div>
        <div className="val">{s.v}</div><div className={"delta "+(s.up?'up':'down')}>{s.up?<I.up style={{width:13,height:13}}/>:<I.clock style={{width:13,height:13}}/>}{s.d}</div>
      </div>)}
    </div>
    <div className="grid" style={{gridTemplateColumns:'1.7fr 1fr',alignItems:'start'}}>
      <div className="card solid view" style={{padding:'18px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <b style={{fontSize:16}}>{role==='client'?t('needsReview'):t('recentActivity')}</b>
          <button className="btn ghost sm" onClick={()=>go('projects')}>{t('viewAll')}</button></div>
        <div className="stagger">{visible.slice(0,4).map((p,i)=><div key={p.id} onClick={()=>go('project',p)} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 6px',borderTop:i?'1px solid var(--sep)':'none',cursor:'pointer',borderRadius:10}} onMouseEnter={e=>e.currentTarget.style.background='var(--sep)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
          <div style={{width:46,height:46,borderRadius:12,background:gradients[p.grad],flex:'0 0 46px',display:'flex',alignItems:'center',justifyContent:'center'}}><I.note style={{width:20,height:20,color:'#fff'}}/></div>
          <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14.5}}>{p.title}</div><div style={{fontSize:12.5,color:'var(--text-3)'}}>{p.sub} · {who(p,role,t)}</div></div>
          <Pill s={p.status}/><I.arrow style={{width:16,height:16,color:'var(--text-3)'}}/></div>)}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card solid" style={{padding:'18px 20px'}}>
          <b style={{fontSize:15,display:'flex',alignItems:'center',gap:8}}><I.activity style={{width:16,height:16,color:'var(--accent-2)'}}/>{t('activityCenter')}</b>
          <div style={{marginTop:6}}>{ACTIVITY.slice(0,role==='admin'?5:3).map((a,i)=><div key={i} style={{display:'flex',gap:11,padding:'10px 0',borderTop:i?'1px solid var(--sep)':'none'}}>
            <span style={{width:30,height:30,borderRadius:9,background:a.color+'22',color:a.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 30px'}}>{I[a.icon]({style:{width:15,height:15}})}</span>
            <div><div style={{fontSize:13,lineHeight:1.35}}>{a.text}</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>{a.time}</div></div></div>)}</div>
        </div>
      </div>
    </div>
  </div>;
}

/* ===== PROJECTS ===== */
function Projects({role,go,toast}){
  const{t}=useT();const[view,setView]=useState('kanban');const[fav,setFav]=useState({3:true});
  const[dl,setDl]=useState(null);const[real,setReal]=useState([]);
  useEffect(()=>{ (async()=>{ try{ const j=await rv('listMine'); setReal(j.items||[]); }catch(e){} })(); },[]);
  const list=myProjects(role);const cols=['pending','progress','review','approved','delivered'];
  const openDl=(p)=>setDl({submissionId:p&&p.submissionId,title:(p&&p.title)||'Project'});
  return <div className="view content">
    {real.length>0&&<div style={{marginBottom:20}}>
      <div className="navlabel" style={{padding:'0 0 9px'}}>Your projects · files in Drive</div>
      <div className="rs-list">{real.map(it=><div key={it.submission_id} className="rs-subcard" style={{cursor:'default'}}>
        <div className="rs-sc-top"><div className="rs-sc-ic"><I.note style={{width:20,height:20}}/></div><div style={{minWidth:0,flex:1}}><h4>{it.project_title}</h4><div className="rs-sc-meta"><span className="rs-dot" style={{background:STATUS_COLOR[it.status]||'var(--text-3)'}}/>{STATUS_LABEL[it.status]||it.status} · {it.versions_count} version{it.versions_count===1?'':'s'}</div></div></div>
        <div style={{display:'flex',gap:8,marginTop:4}}><button className="btn ghost sm" style={{flex:1,justifyContent:'center'}} onClick={()=>go('review')}><I.chat style={{width:14,height:14}}/>Review</button><button className="btn sm" style={{flex:1,justifyContent:'center'}} onClick={()=>setDl({submissionId:it.submission_id,title:it.project_title})}><I.down style={{width:14,height:14}}/>Download</button></div>
      </div>)}</div>
    </div>}
    <div className="h-row"><div><h1>{t('nav_projects')}</h1><p>{list.length} {t('projectsCount')} · {role==='client'?t('clientHidden'):role==='artist'?t('artistHidden'):t('fullMgmt')}</p></div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <div className="seg"><button className={view==='kanban'?'on':''} onClick={()=>setView('kanban')}>{t('kanban')}</button><button className={view==='list'?'on':''} onClick={()=>setView('list')}>{t('list')}</button></div>
        {role==='admin'&&<button className="btn" onClick={()=>go('new')}><I.plus style={{width:16,height:16}}/>{t('newProject')}</button>}</div></div>
    {view==='kanban'?<div className="kan">{cols.map(c=>{const items=list.filter(p=>p.status===c);return <div className="kancol" key={c}>
      <div className="kanhead"><span className="pdot" style={{width:9,height:9,borderRadius:'50%',background:SC[c]}}/>{t('st_'+c)}<span className="ct">{items.length}</span></div>
      {items.map(p=><div className="kancard" key={p.id} onClick={()=>go('project',p)}>
        <Cover grad={p.grad}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><h4>{p.title}</h4>
          <div style={{display:'flex',alignItems:'center',gap:2}}><button onClick={(e)=>{e.stopPropagation();openDl(p);}} style={{color:'var(--text-3)'}} title="Download files"><I.down style={{width:15,height:15}}/></button><button onClick={(e)=>{e.stopPropagation();setFav({...fav,[p.id]:!fav[p.id]});}} style={{color:fav[p.id]?'var(--orange)':'var(--text-3)'}}>{fav[p.id]?<I.starF style={{width:16,height:16}}/>:<I.star style={{width:16,height:16}}/>}</button></div></div>
        <div style={{fontSize:12,color:'var(--text-3)'}}>{p.sub}</div>
        <div className="progressbar" style={{marginTop:10}}><i style={{width:p.prog+'%'}}/></div>
        <div className="kmeta"><Pri p={p.pri}/><span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4}}><I.cal style={{width:13,height:13}}/>{p.due}</span></div>
      </div>)}{items.length===0&&<div style={{fontSize:12.5,color:'var(--text-3)',textAlign:'center',padding:'20px 0'}}>—</div>}</div>;})}</div>
    :<div className="card solid view" style={{padding:'16px 8px 8px'}}><table className="tbl"><thead><tr><th>{t('title')}</th><th>{role==='admin'?t('artistF'):role==='artist'?t('clientF'):t('artistF')}</th><th>{t('status')}</th><th>{t('priority')}</th><th>{t('progress')}</th><th>{t('deliver')}</th></tr></thead>
      <tbody>{list.map(p=><tr key={p.id} onClick={()=>go('project',p)}>
        <td><div style={{display:'flex',alignItems:'center',gap:11}}><div style={{width:38,height:38,borderRadius:10,background:gradients[p.grad],flex:'0 0 38px'}}/><div><div style={{fontWeight:600}}>{p.title}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{p.sub}</div></div></div></td>
        <td>{role==='admin'?p.artistName:<span className="anon-tag"><I.lock style={{width:11,height:11}}/>{t('anonymous')}</span>}</td>
        <td><Pill s={p.status}/></td><td><Pri p={p.pri}/></td>
        <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="progressbar" style={{width:70}}><i style={{width:p.prog+'%'}}/></div><span style={{fontSize:12,color:'var(--text-3)'}}>{p.prog}%</span></div></td>
        <td style={{fontWeight:560,color:p.pri==='urgent'?'var(--red)':'inherit'}}>{p.due} <button onClick={(e)=>{e.stopPropagation();openDl(p);}} style={{color:'var(--text-3)',marginLeft:6,verticalAlign:'middle'}} title="Download files"><I.down style={{width:14,height:14}}/></button></td></tr>)}</tbody></table></div>}
    {dl&&<DownloadPopup submissionId={dl.submissionId} title={dl.title} close={()=>setDl(null)} toast={toast||(()=>{})}/>}
  </div>;
}
/* ===== PROJECT DETAIL ===== */
function ProjectDetail({p,role,go,toast}){
  const{t}=useT();const[tab,setTab]=useState('overview');const[playing,setPlaying]=useState(false);const[prog,setProg]=useState(0.33);const[compare,setCompare]=useState(false);const[mouSigned,setMouSigned]=useState(p.mou.signedByClient);
  const tabs=[['overview',t('tab_overview')],['songs',t('tab_songs')],['versions',t('tab_versions')],['comments',t('tab_comments')+(p.comments.length?` (${p.comments.length})`:'')],['mou',t('tab_mou')],['files',t('tab_files')],['chat',t('tab_chat')]];
  const markers=p.comments.map(c=>{const[m,s]=c.ts.split(':').map(Number);return(m*60+s)/180;});
  const canApprove=role==='client'&&p.status==='review';
  useEffect(()=>{if(!playing)return;const tm=setInterval(()=>setProg(x=>x>=1?0:x+0.008),120);return()=>clearInterval(tm);},[playing]);
  const counterpart=role==='admin'?`${p.artistName} → ${p.clientName}`:role==='artist'?t('anonClient'):t('anonArtist');
  return <div className="view content narrow">
    <button className="btn ghost sm" onClick={()=>go('projects')} style={{marginBottom:18}}><I.back style={{width:15,height:15}}/>{t('nav_projects')}</button>
    <div className="pd-head">
      <div className="pd-cover" style={{background:gradients[p.grad]}} onClick={()=>setPlaying(!playing)}><div className="pc-play"><span>{playing?<I.pause style={{width:22,height:22,color:'#1d1d1f'}}/>:<I.play style={{width:22,height:22,color:'#1d1d1f',marginLeft:3}}/>}</span></div></div>
      <div style={{flex:1,minWidth:240}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}><Pill s={p.status}/><Pri p={p.pri}/>{!mouSigned&&<span className="chip" style={{color:'var(--orange)',background:'rgba(255,159,10,.16)'}}><I.contract style={{width:12,height:12}}/>{t('mouStep')}</span>}</div>
        <h1 style={{fontSize:30,fontWeight:730,letterSpacing:'-0.03em'}}>{p.title}</h1>
        <p style={{color:'var(--text-2)',marginTop:4,fontSize:15}}>{p.sub}</p>
        <div style={{display:'flex',alignItems:'center',gap:18,marginTop:14,fontSize:13,color:'var(--text-2)',flexWrap:'wrap'}}>
          <span style={{display:'flex',alignItems:'center',gap:6}}>{role==='admin'?<><I.users style={{width:15,height:15}}/>{counterpart}</>:<span className="anon-tag"><I.lock style={{width:12,height:12}}/>{counterpart}</span>}</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><I.cal style={{width:15,height:15}}/>{t('deliver')} {p.due}</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><I.disc style={{width:15,height:15}}/>{p.songs.length} {t('songs').toLowerCase()}</span>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:9,alignItems:'flex-end'}}>
        {canApprove&&<><button className="btn green" onClick={()=>{toast('✓ '+t('approve'));go('projects');}}><I.check style={{width:16,height:16}}/>{t('approve')}</button>
          <button className="btn ghost" onClick={()=>toast(t('requestChanges'))}>{t('requestChanges')}</button>
          <button className="btn red" onClick={()=>toast(t('reject'))}>{t('reject')}</button></>}
        {role==='artist'&&<><button className="btn" onClick={()=>toast(t('uploadFiles'))}><I.up style={{width:16,height:16}}/>{t('uploadVersion')}</button>
          <button className="btn ghost" onClick={()=>toast('✓ '+t('markDone'))}>{t('markDone')}</button></>}
        {role==='admin'&&<><button className="btn green" onClick={()=>toast('✓ '+t('approveDelivery'))}><I.check style={{width:16,height:16}}/>{t('approveDelivery')}</button>
          <button className="btn ghost" onClick={()=>toast(t('generateInvoice'))}><I.receipt style={{width:15,height:15}}/>{t('generateInvoice')}</button></>}
      </div>
    </div>
    <div className="card solid" style={{padding:'16px 22px',marginBottom:22}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <button className="pp-btn" onClick={()=>setPlaying(!playing)}>{playing?<I.pause style={{width:20,height:20}}/>:<I.play style={{width:20,height:20,marginLeft:2}}/>}</button>
        <div style={{flex:1}}><div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--text-3)',marginBottom:6}}><span>{p.versions[0].v} · {p.versions[0].label}</span><span>{Math.floor(prog*180/60)}:{String(Math.floor(prog*180%60)).padStart(2,'0')} / 3:00</span></div>
          <Waveform seed={p.seed} progress={prog} markers={markers} onSeek={setProg}/></div>
        <button className="btn ghost sm" onClick={()=>setCompare(!compare)}><I.wave style={{width:14,height:14}}/>A/B</button>
      </div>
      {compare&&<div style={{marginTop:16,paddingTop:16,borderTop:'1px solid var(--sep)',animation:'fadeUp .35s'}}><div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:14}}>{[p.versions[1]||p.versions[0],p.versions[0]].map((v,i)=><div key={i} style={{background:'var(--sep)',borderRadius:12,padding:'12px 14px'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:8}}><b>{v.v} {i===1?'(B)':'(A)'}</b><span style={{color:'var(--text-3)'}}>{v.date}</span></div><Waveform seed={p.seed+i*3} progress={0.5}/></div>)}</div></div>}
    </div>
    <div className="tabs">{tabs.map(([k,l])=><button key={k} className={"tab"+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>)}</div>

    {tab==='overview'&&<div className="view grid" style={{gridTemplateColumns:'1.6fr 1fr',alignItems:'start'}}>
      <div className="card solid" style={{padding:'20px 22px'}}><b style={{fontSize:15}}>{t('brief')}</b><p style={{marginTop:10,fontSize:14,lineHeight:1.6,color:'var(--text-2)'}}>{p.brief}</p>
        <div style={{marginTop:18,paddingTop:16,borderTop:'1px solid var(--sep)'}}><b style={{fontSize:13.5}}>{t('timeline')}</b>
          <div style={{marginTop:12}}>{[...p.versions].reverse().map((v,i,arr)=><div key={i} style={{display:'flex',gap:14}}><div style={{display:'flex',flexDirection:'column',alignItems:'center'}}><div style={{width:12,height:12,borderRadius:'50%',background:v.status==='approved'?'var(--green)':v.status==='changes'?'var(--orange)':'var(--accent)',marginTop:3}}/>{i<arr.length-1&&<div style={{width:2,flex:1,background:'var(--sep)',minHeight:30}}/>}</div><div style={{paddingBottom:18}}><div style={{fontSize:13.5,fontWeight:600}}>{v.v} · {v.label}</div><div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>{v.date} · {v.size}</div></div></div>)}</div></div></div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card solid" style={{padding:'20px 22px',display:'flex',alignItems:'center',gap:16}}><Ring pct={p.prog}/><div><div style={{fontSize:26,fontWeight:720}}>{p.prog}%</div><div style={{fontSize:12.5,color:'var(--text-3)'}}>{t('completed')}</div></div></div>
        {role!=='artist'&&<div className="card solid" style={{padding:'18px 20px'}}><b style={{fontSize:14,display:'flex',alignItems:'center',gap:8}}><I.dollar style={{width:16,height:16,color:'var(--green)'}}/>{t('total')}</b>
          <div style={{fontSize:24,fontWeight:720,marginTop:6}}>{fmt(p.pricing.total)}</div>
          <div style={{fontSize:12.5,color:'var(--text-3)',marginTop:2}}>{t('master')} {fmt(p.pricing.masterPrice)} · {t('stems')} {fmt(p.pricing.stemsPrice)}</div></div>}
      </div>
    </div>}

    {tab==='songs'&&<div className="card solid view" style={{padding:'18px 20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><b style={{fontSize:15}}>{t('masterStems')}</b>{role==='admin'&&<button className="btn ghost sm"><I.plus style={{width:14,height:14}}/>{t('addSong')}</button>}</div>
      {p.songs.map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 4px',borderTop:i?'1px solid var(--sep)':'none'}}>
        <div style={{width:40,height:40,borderRadius:11,background:gradients[(p.grad+i)%6],flex:'0 0 40px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>{String(i+1).padStart(2,'0')}</div>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14.5}}>{s.name}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{p.sub}</div></div>
        <span className="chip" style={{color:s.master?'#0a84ff':'var(--text-3)',background:s.master?'rgba(10,132,255,.14)':'var(--sep)'}}><I.disc style={{width:12,height:12}}/>{t('master')}{role!=='artist'&&' · '+fmt(p.pricing.masterPrice)}</span>
        <span className="chip" style={{color:s.stems?'#ff9f0a':'var(--text-3)',background:s.stems?'rgba(255,159,10,.14)':'var(--sep)'}}><I.layers style={{width:12,height:12}}/>{t('stems')}{s.stems?(role!=='artist'?' · '+fmt(p.pricing.stemsPrice):''):' ✕'}</span>
      </div>)}
    </div>}

    {tab==='versions'&&<div className="card solid view" style={{padding:'8px 8px'}}><table className="tbl"><thead><tr><th>{t('tab_versions')}</th><th>{t('description')}</th><th>{t('issued')}</th><th></th><th>{t('status')}</th><th></th></tr></thead>
      <tbody>{p.versions.map((v,i)=><tr key={i}><td><b>{v.v}</b>{i===0&&<span style={{marginLeft:8,fontSize:11,color:'var(--accent)',fontWeight:600}}>{t('latest')}</span>}</td><td>{v.label}</td><td>{v.date}</td><td>{v.size}</td>
        <td>{v.status==='approved'?<Pill s="approved"/>:v.status==='changes'?<span className="pill" style={{color:'var(--orange)',background:'rgba(255,159,10,.16)'}}><span className="pdot" style={{background:'var(--orange)'}}/>{t('changesRequested')}</span>:<Pill s="review"/>}</td>
        <td><div style={{display:'flex',gap:6,justifyContent:'flex-end'}}><button className="iconbtn"><I.play style={{width:15,height:15}}/></button><button className="iconbtn"><I.down style={{width:16,height:16}}/></button></div></td></tr>)}</tbody></table></div>}

    {tab==='comments'&&<div className="card solid view" style={{padding:'8px 22px'}}>
      {p.comments.length?p.comments.map((c,i)=><div className="comment" key={i}><Avatar name={c.who==='client'?'Client A':'Artist N'} i={c.who==='client'?1:0} size={36}/>
        <div className="body"><div className="top"><b>{role==='admin'?(c.who==='client'?p.clientName:p.artistName):(c.who===role?'You':c.who==='client'?t('anonClient'):t('anonArtist'))}</b><span className="ts">⏱ {c.ts}</span><span style={{fontSize:11.5,color:'var(--text-3)',marginLeft:'auto'}}>{c.time}</span></div><p>{c.text}</p></div></div>)
        :<div className="empty"><I.chat style={{width:40,height:40,margin:'0 auto 12px',opacity:.4}}/><div>{t('noComments')}</div></div>}
      <div style={{padding:'14px 0',borderTop:'1px solid var(--sep)',display:'flex',gap:10,alignItems:'center'}}><input placeholder={t('addComment')} style={{flex:1,background:'var(--sep)',border:'none',borderRadius:11,padding:'10px 13px',fontSize:14,color:'var(--text)',outline:'none'}}/><button className="btn sm">{t('comment')}</button></div></div>}

    {tab==='mou'&&<MOUCard p={p} role={role} signed={mouSigned} onSign={()=>{setMouSigned(true);toast('✓ MOU '+t('signed'));}} toast={toast}/>}
    {tab==='files'&&<FilesPanel p={p} role={role} toast={toast}/>}
    {tab==='chat'&&<ModeratedChat p={p} role={role}/>}
  </div>;
}

function MOUCard({p,role,signed,onSign}){
  const{t}=useT();
  return <div className="view card solid" style={{padding:'24px 26px',maxWidth:760}}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}><I.contract style={{width:20,height:20,color:'var(--accent-2)'}}/><b style={{fontSize:17}}>{t('mou')} — {p.title}</b>
      <span className="chip" style={{marginLeft:'auto',color:signed?'var(--green)':'var(--orange)',background:signed?'rgba(52,199,89,.14)':'rgba(255,159,10,.14)'}}>{signed?t('signed'):t('awaitingSig')}</span></div>
    <p style={{fontSize:13.5,color:'var(--text-2)',lineHeight:1.6,marginBottom:18}}>{t('mouIntro')}</p>
    <div style={{background:'var(--sep)',borderRadius:14,padding:'18px 20px',fontSize:13.5,lineHeight:1.7,marginBottom:18}}>
      <b>Memorandum of Understanding</b><br/>
      {COMPANY.name} (“Producer”) and {role==='admin'?p.clientName:'the Client'} (“Client”) agree to commence work on the brief “{p.title}” comprising {p.songs.length} song(s).
      Deliverables: master{p.songs.some(s=>s.stems)?' and stems':''} per the agreed scope. Pricing: {p.pricing.model==='persong'?fmt(p.pricing.perSong)+' / song':fmt(p.pricing.total)+' total'}.
      Full deliverables and documentation follow upon completion of the brief.
    </div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:14}}>
      <div className="signbox"><div><div style={{fontSize:11.5,color:'var(--text-3)'}}>{COMPANY.name}</div><div className="signed-script" style={{color:'var(--accent-2)'}}>{COMPANY.signatory}</div></div><span className="chip" style={{color:'var(--green)',background:'rgba(52,199,89,.14)'}}><I.check style={{width:12,height:12}}/>{t('signedByUs')}</span></div>
      <div className="signbox"><div><div style={{fontSize:11.5,color:'var(--text-3)'}}>{role==='admin'?p.clientName:t('yourSignature')}</div>{signed?<div className="signed-script" style={{color:'var(--accent)'}}>{p.clientName}</div>:<div style={{fontSize:14,color:'var(--text-3)',fontStyle:'italic'}}>{t('awaitingSig')}…</div>}</div>
        {!signed&&role==='client'?<button className="btn green sm" onClick={onSign}><I.pen style={{width:14,height:14}}/>{t('signNow')}</button>:signed?<span className="chip" style={{color:'var(--green)',background:'rgba(52,199,89,.14)'}}><I.check style={{width:12,height:12}}/>{t('signed')}</span>:<span className="chip" style={{color:'var(--orange)',background:'rgba(255,159,10,.14)'}}>{t('awaitingSig')}</span>}</div>
    </div>
  </div>;
}

function FilesPanel({p,role,toast}){
  const{t}=useT();const client=CLIENTS.find(c=>c.code===p.clientCode);
  return <div className="card solid view" style={{padding:'18px 16px'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6,padding:'0 6px'}}><b style={{fontSize:15,display:'flex',alignItems:'center',gap:8}}><I.drive style={{width:18,height:18,color:'var(--green)'}}/>{t('tab_files')} · Google Drive</b>{role==='artist'&&<button className="btn sm" onClick={()=>toast(t('dropHere'))}><I.up style={{width:14,height:14}}/>{t('uploadFiles')}</button>}</div>
    <div style={{padding:'4px 6px 10px',fontSize:11.5,color:'var(--text-3)'}} className="mono">/{client.root}/Brief — {p.title}/</div>
    {p.files.map((f,i)=>{const ext=f.split('.').pop();const meta={wav:['#0a84ff'],zip:['#ff9f0a'],pdf:['#ff3b30'],png:['#34c759'],mp3:['#5e5ce6']}[ext]||['#8e8e93'];
      return <div className="fileitem" key={i}><div className="fileicon" style={{width:38,height:38,flex:'0 0 38px',background:meta[0]+'22',color:meta[0]}}>{ext==='wav'||ext==='mp3'?<I.note style={{width:18,height:18}}/>:ext==='zip'?<I.layers style={{width:18,height:18}}/>:<I.folder style={{width:18,height:18}}/>}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:540}}>{f}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{t('syncedDrive')}</div></div>
        <button className="iconbtn"><I.drive style={{width:16,height:16}}/></button><button className="iconbtn"><I.down style={{width:17,height:17}}/></button></div>;})}
  </div>;
}

/* ===== MODERATED CHAT ===== */
function ModeratedChat({p,role}){
  const{t}=useT();
  const[msgs,setMsgs]=useState([{me:false,text:"Hi, how's the mix coming along?"},{me:true,text:"Going well. I'll upload a new version this week."},{me:false,text:"Perfect. Can you reinforce the bass in the chorus?"}]);
  const[val,setVal]=useState('');const[blocked,setBlocked]=useState(false);const scrollRef=useRef();
  const them=role==='artist'?t('anonClient'):t('anonArtist');
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[msgs,blocked]);
  const PAT=[/[\w.+-]+@[\w-]+\.[\w.]+/,/(\+?\d[\d\s\-().]{7,}\d)/,/https?:\/\/\S+|www\.\S+|\b\S+\.(com|net|org|io|co|me)\b/i,/@[A-Za-z0-9_]{3,}/,/\b(whatsapp|instagram|telegram|insta|tiktok|gmail|email|phone|number|contact)\b/i];
  const send=()=>{if(!val.trim())return;if(PAT.some(re=>re.test(val))){setBlocked(true);setVal('');setTimeout(()=>setBlocked(false),3800);return;}setMsgs([...msgs,{me:true,text:val}]);setVal('');};
  return <div className="chat view">
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'2px 4px 14px',borderBottom:'1px solid var(--sep)',marginBottom:6}}><Avatar name={role==='artist'?'C A':'A N'} i={role==='artist'?1:0} size={36}/>
      <div><b style={{fontSize:14}}>{role==='admin'?p.title:them}</b><div style={{fontSize:11.5,color:'var(--text-3)',display:'flex',alignItems:'center',gap:5}}><I.shield style={{width:12,height:12,color:'var(--green)'}}/>{t('moderatedChat')}</div></div></div>
    <div className="chatscroll" ref={scrollRef}><div className="chatblock"><I.shield style={{width:14,height:14}}/>{t('chatNotice')}</div>
      {msgs.map((m,i)=><div key={i} className={"msg "+(m.me?'me':'them')}>{!m.me&&<div className="who">{them}</div>}{m.text}</div>)}
      {blocked&&<div className="chatblock" style={{background:'rgba(255,59,48,.14)',color:'var(--red)'}}><I.lock style={{width:14,height:14}}/>{t('msgBlocked')}</div>}</div>
    <div className="chatbar"><input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder={t('typeMsg')}/><button className="pp-btn" style={{width:38,height:38,flex:'0 0 38px',background:'var(--accent)',color:'#fff'}} onClick={send}><I.arrow style={{width:18,height:18}}/></button></div>
  </div>;
}
/* ===== DRIVE (deep sync) ===== */
function fileName(client,song,type,v){return `IdealMusic_${client}_${song.replace(/\s+/g,'')}_${type}_${v}.${type==='Stems'?'zip':'wav'}`;}
function TreeNode({label,icon,color,children,depth=0,open:o=true,mono}){
  const[open,setOpen]=useState(o);const has=React.Children.count(children)>0;
  return <div><div className="tnode" onClick={()=>has&&setOpen(!open)}>
    {has?(open?<I.chevD style={{width:14,height:14,color:'var(--text-3)'}}/>:<I.chevR style={{width:14,height:14,color:'var(--text-3)'}}/>):<span style={{width:14}}/>}
    <span style={{color:color||'var(--text-2)',display:'flex'}}>{icon}</span>
    <span style={mono?{fontFamily:'"SF Mono",ui-monospace,monospace',fontSize:12}:{fontWeight:depth<2?600:400}}>{label}</span></div>
    {open&&has&&<div className="tchild">{children}</div>}</div>;
}
function DriveView({role,toast}){
  const{t}=useT();const[upl,setUpl]=useState(false);
  const clients=role==='client'?CLIENTS.filter(c=>['LUNARECS','SUNSETCO'].includes(c.code)):CLIENTS;
  return <div className="view content narrow">
    <div className="h-row"><div><h1 style={{display:'flex',alignItems:'center',gap:10}}><I.drive style={{width:28,height:28,color:'var(--green)'}}/>{t('driveTitle')}</h1><p>{t('driveSub')}</p></div>
      <button className="btn" onClick={()=>setUpl(true)}><I.cloud style={{width:16,height:16}}/>{t('uploadFiles')}</button></div>
    <div className="grid" style={{gridTemplateColumns:'1.5fr 1fr',alignItems:'start'}}>
      <div className="card solid" style={{padding:'16px 18px'}}>
        <b style={{fontSize:15,display:'flex',alignItems:'center',gap:8,marginBottom:8}}><I.layers style={{width:16,height:16,color:'var(--accent)'}}/>{t('autoStructure')}</b>
        <div className="tree">{clients.map(c=>{const briefs=PROJECTS.filter(p=>p.clientCode===c.code);return <TreeNode key={c.code} label={c.root+"/"} icon={<I.folder style={{width:17,height:17}}/>} color="#0a84ff" depth={0} open={c.code==='LUNARECS'||c.code==='SUNSETCO'}>
          {briefs.map(p=><TreeNode key={p.id} label={"Brief — "+p.title+"/"} icon={<I.folder style={{width:16,height:16}}/>} color="#5e5ce6" depth={1} open={p.id===1}>
            {p.songs.map((s,i)=><TreeNode key={i} label={String(i+1).padStart(2,'0')+" "+s.name+"/"} icon={<I.disc style={{width:15,height:15}}/>} color="#ff9f0a" depth={2} open={p.id===1&&i===0}>
              {s.master&&<TreeNode label={fileName(c.code,s.name,"Master",p.versions[0].v)} icon={<I.note style={{width:14,height:14}}/>} color="#0a84ff" depth={3} mono/>}
              {s.stems&&<TreeNode label={fileName(c.code,s.name,"Stems",p.versions[0].v)} icon={<I.layers style={{width:14,height:14}}/>} color="#ff9f0a" depth={3} mono/>}
            </TreeNode>)}
          </TreeNode>)}
        </TreeNode>;})}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="card solid" style={{padding:'18px 20px'}}><b style={{fontSize:14,display:'flex',alignItems:'center',gap:8}}><I.pen style={{width:15,height:15,color:'var(--accent-2)'}}/>{t('namingConvention')}</b>
          <div className="mono" style={{marginTop:12,background:'var(--sep)',borderRadius:10,padding:'12px 14px',fontSize:11.5,lineHeight:1.7,wordBreak:'break-all'}}>
            <span style={{color:'var(--accent)'}}>IdealMusic</span>_<span style={{color:'var(--accent-2)'}}>{'{ClientCode}'}</span>_<span style={{color:'var(--orange)'}}>{'{Song}'}</span>_<span style={{color:'var(--green)'}}>{'{Master|Stems}'}</span>_<span>{'{vN}'}</span>.<span style={{color:'var(--text-3)'}}>{'{ext}'}</span></div>
          <div style={{fontSize:12,color:'var(--text-3)',marginTop:10}}>Every upload is auto-renamed and filed into the correct song folder.</div></div>
        <div className="card solid" style={{padding:'18px 20px'}}><b style={{fontSize:14}}>{t('recentFiles')}</b>
          <div style={{marginTop:8}}>{[['IdealMusic_LUNARECS_MidnightBloom_Master_v3.wav','#0a84ff'],['IdealMusic_SUNSETCO_SunsetDrive_Stems_v2.zip','#ff9f0a'],['IdealMusic_NEONLAB_NeonTokyo_Master_v4.wav','#0a84ff']].map((f,i)=><div className="fileitem" key={i} style={{padding:'9px 8px'}}><div className="fileicon" style={{width:30,height:30,flex:'0 0 30px',background:f[1]+'22',color:f[1]}}><I.note style={{width:15,height:15}}/></div><div className="mono" style={{flex:1,fontSize:11,wordBreak:'break-all'}}>{f[0]}</div></div>)}</div></div>
      </div>
    </div>
    {upl&&<UploadModal close={()=>setUpl(false)} toast={toast}/>}
  </div>;
}
function UploadModal({close,toast}){
  const{t}=useT();const[stage,setStage]=useState(0);const[song,setSong]=useState('Midnight Bloom');const[type,setType]=useState('Master');const[client,setClient]=useState('LUNARECS');
  const renamed=fileName(client,song,type,'v4');
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('uploadFiles')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:18}}>{t('dropHere')}</p>
    {stage===0?<>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div className="field"><label>{t('clientF')}</label><select value={client} onChange={e=>setClient(e.target.value)}>{CLIENTS.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
        <div className="field"><label>{t('song')}</label><input value={song} onChange={e=>setSong(e.target.value)}/></div></div>
      <div className="field"><label>Type</label><div className="seg" style={{width:'100%'}}><button className={type==='Master'?'on':''} style={{flex:1}} onClick={()=>setType('Master')}>{t('master')}</button><button className={type==='Stems'?'on':''} style={{flex:1}} onClick={()=>setType('Stems')}>{t('stems')}</button></div></div>
      <div className="dropzone" onClick={()=>setStage(1)}><I.cloud style={{width:36,height:36,margin:'0 auto 10px'}}/><div style={{fontWeight:600,fontSize:14}}>{t('dropHere')}</div></div>
    </>:<>
      <div style={{textAlign:'center',padding:'10px 0 18px'}}><div style={{width:60,height:60,borderRadius:'50%',background:'rgba(52,199,89,.16)',color:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><I.check style={{width:30,height:30}}/></div>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:6}}>Auto-renamed &amp; filed to:</div>
        <div className="mono" style={{fontSize:12,background:'var(--sep)',borderRadius:10,padding:'10px 12px',wordBreak:'break-all'}}>/{CLIENTS.find(c=>c.code===client).root}/Brief/{song}/<br/><b>{renamed}</b></div></div>
    </>}
    <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button>
      {stage===1&&<button className="btn green" style={{flex:1,justifyContent:'center'}} onClick={()=>{close();toast('✓ '+t('syncedDrive'));}}>{t('save')}</button>}</div>
  </div></div>;
}

/* ===== REQUESTS ===== */
function Requests({role,toast}){
  const{t}=useT();const[mk,setMk]=useState(false);const[neg,setNeg]=useState(null);
  const RS={new:"#0a84ff",negotiating:"#ff9f0a",approved:"#34c759",declined:"#8e8e93"};
  const list=role==='client'?REQUESTS.filter(r=>r.clientCode==='LUNARECS'):REQUESTS;
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('requestsTitle')}</h1><p>{role==='client'?'Request songs and we’ll send a quote.':'Approve, negotiate or decline incoming requests.'}</p></div>
      {role==='client'&&<button className="btn" onClick={()=>setMk(true)}><I.plus style={{width:16,height:16}}/>{t('newRequest')}</button>}</div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      {list.map(r=><div className="card solid hover" key={r.id} style={{padding:'18px 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
          {role==='admin'?<Avatar name={r.clientName} i={CLIENTS.find(c=>c.code===r.clientCode).i} size={40}/>:<div style={{width:40,height:40,borderRadius:11,background:gradients[0],display:'flex',alignItems:'center',justifyContent:'center'}}><I.inbox style={{width:18,height:18,color:'#fff'}}/></div>}
          <div style={{flex:1}}><b style={{fontSize:15}}>{r.songs} {t('songs').toLowerCase()}</b><div style={{fontSize:12,color:'var(--text-3)'}}>{role==='admin'?r.clientName:'Your request'} · {r.time}</div></div>
          <span className="chip" style={{color:RS[r.status],background:RS[r.status]+'22'}}>{t('reqStatus_'+r.status)}</span></div>
        <p style={{fontSize:13.5,color:'var(--text-2)',lineHeight:1.5,marginBottom:12}}>{r.notes}</p>
        <div style={{display:'flex',alignItems:'center',gap:10,fontSize:12.5,color:'var(--text-3)',marginBottom:role==='admin'&&r.status!=='approved'&&r.status!=='declined'?14:0}}>
          <span className="chip" style={{background:'var(--sep)'}}>{r.budgetType==='persong'?t('perSong'):t('total')}</span>
          {r.proposedTotal>0&&<b style={{color:'var(--text)'}}>{r.proposedPerSong>0?fmt(r.proposedPerSong)+' / song · ':''}{fmt(r.proposedTotal)}</b>}</div>
        {role==='admin'&&r.status!=='approved'&&r.status!=='declined'&&<div style={{display:'flex',gap:8}}>
          <button className="btn green sm" onClick={()=>toast('✓ '+t('approveReq'))}>{t('approveReq')}</button>
          <button className="btn ghost sm" onClick={()=>setNeg(r)}>{t('negotiate')}</button>
          <button className="btn ghost sm" style={{color:'var(--red)'}} onClick={()=>toast(t('decline'))}>{t('decline')}</button></div>}
      </div>)}
    </div>
    {mk&&<RequestModal close={()=>setMk(false)} toast={toast}/>}
    {neg&&<NegotiateModal r={neg} close={()=>setNeg(null)} toast={toast}/>}
  </div>;
}
function RequestModal({close,toast}){
  const{t}=useT();const[type,setType]=useState('persong');
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:18}}>{t('newRequest')}</h2>
    <div className="field"><label>{t('requestSongs')}</label><input type="number" defaultValue="3"/></div>
    <div className="field"><label>{t('budget')}</label><div className="seg" style={{width:'100%'}}><button className={type==='persong'?'on':''} style={{flex:1}} onClick={()=>setType('persong')}>{t('perSong')}</button><button className={type==='total'?'on':''} style={{flex:1}} onClick={()=>setType('total')}>{t('total')}</button></div></div>
    <div className="field"><label>{t('notes')}</label><textarea rows="3" placeholder="Style, BPM, references…"></textarea></div>
    <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn" style={{flex:1,justifyContent:'center'}} onClick={()=>{close();toast('✓ '+t('submitRequest'));}}>{t('submitRequest')}</button></div>
  </div></div>;
}
function NegotiateModal({r,close,toast}){
  const{t}=useT();const[type,setType]=useState(r.budgetType);
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('proposeRate')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:18}}>{r.clientName} · {r.songs} {t('songs').toLowerCase()}</p>
    <div className="field"><label>{t('budget')}</label><div className="seg" style={{width:'100%'}}><button className={type==='persong'?'on':''} style={{flex:1}} onClick={()=>setType('persong')}>{t('perSong')}</button><button className={type==='total'?'on':''} style={{flex:1}} onClick={()=>setType('total')}>{t('total')}</button></div></div>
    {type==='persong'?<div className="field"><label>{t('perSong')} ($)</label><input type="number" defaultValue="1200"/></div>:<div className="field"><label>{t('total')} ($)</label><input type="number" defaultValue="3200"/></div>}
    <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn" style={{flex:1,justifyContent:'center'}} onClick={()=>{close();toast('✓ '+t('sendContract'));}}><I.send style={{width:14,height:14}}/>{t('sendContract')}</button></div>
  </div></div>;
}

/* ===== CONTRACTS ===== */
function Contracts({role,toast}){
  const{t}=useT();
  const list=role==='client'?CONTRACTS.filter(c=>c.clientName==='Lunar Records'):role==='artist'?CONTRACTS.filter(c=>c.artistName==='Nova Reyes'):CONTRACTS;
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('contractsTitle')}</h1><p>{role==='admin'?'MOUs and agreements — pre-signed by Ideal Music.':'Sign to begin your brief.'}</p></div></div>
    <div className="card solid" style={{padding:'8px 8px'}}><table className="tbl"><thead><tr><th>{t('mou')} / {t('agreement')}</th><th>{t('party_client')}/{t('party_artist')}</th><th>{role==='admin'?t('clientF')+' / '+t('artistF'):t('nav_projects')}</th><th>{t('status')}</th><th></th></tr></thead>
      <tbody>{list.map(c=><tr key={c.id}><td><div style={{display:'flex',alignItems:'center',gap:11}}><div className="fileicon" style={{width:36,height:36,flex:'0 0 36px',background:c.type==='MOU'?'rgba(94,92,230,.16)':'rgba(48,176,199,.16)',color:c.type==='MOU'?'#5e5ce6':'#30b0c7'}}><I.contract style={{width:18,height:18}}/></div><div><div style={{fontWeight:600}}>{c.type} · {c.name}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{c.type==='MOU'?'Memorandum':'Artist agreement'}</div></div></div></td>
        <td>{c.party==='client'?t('party_client'):t('party_artist')}</td>
        <td>{role==='admin'?(c.clientName||c.artistName):c.name}</td>
        <td>{c.status==='signed'?<span className="chip" style={{color:'var(--green)',background:'rgba(52,199,89,.14)'}}><I.check style={{width:12,height:12}}/>{t('signed')}</span>:<span className="chip" style={{color:'var(--orange)',background:'rgba(255,159,10,.14)'}}><I.clock style={{width:12,height:12}}/>{t('awaitingSig')}</span>}</td>
        <td style={{textAlign:'right'}}>{c.status==='awaiting'&&role==='client'?<button className="btn green sm" onClick={()=>toast('✓ MOU '+t('signed'))}><I.pen style={{width:13,height:13}}/>{t('signNow')}</button>:role==='admin'&&c.status==='awaiting'?<button className="btn ghost sm" onClick={()=>toast(t('sendContract'))}><I.send style={{width:13,height:13}}/>{t('send')}</button>:<button className="iconbtn"><I.down style={{width:16,height:16}}/></button>}</td></tr>)}</tbody></table></div>
  </div>;
}

/* ===== INVOICES ===== */
const invTotal=(inv)=>inv.items.reduce((a,it)=>a+it.qty*it.rate,0);
function Invoices({role,toast}){
  const{t}=useT();const[gen,setGen]=useState(false);const[view,setView]=useState(null);const[pay,setPay]=useState(null);const[,force]=useState(0);
  const IC={draft:"#8e8e93",sent:"#0a84ff",partial:"#ff9f0a",paid:"#34c759"};
  const list=role==='client'?INVOICES.filter(i=>i.clientName==='Lunar Records'):INVOICES;
  if(view)return <InvoiceView inv={view} back={()=>setView(null)} toast={toast}/>;
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('invoicesTitle')}</h1><p>{role==='admin'?'Track invoices, payment progress and outstanding balances.':'Your invoices and payment status.'}</p></div>
      {role==='admin'&&<button className="btn" onClick={()=>setGen(true)}><I.plus style={{width:16,height:16}}/>{t('generateInvoice')}</button>}</div>
    <div className="card solid" style={{padding:'8px 8px'}}><table className="tbl"><thead><tr><th>{t('invNumber')}</th><th>{t('billTo')}</th><th>{t('nav_projects')}</th><th>{t('amount')}</th><th>{t('balance')}</th><th>{t('status')}</th></tr></thead>
      <tbody>{list.map(inv=>{const tot=invTotal(inv);return <tr key={inv.id} onClick={()=>setView(inv)}><td><b className="mono" style={{fontSize:12.5}}>{inv.number}</b></td><td>{inv.clientName}</td><td>{inv.project}</td><td style={{fontWeight:600}}>{fmt(tot)}</td>
        <td style={{color:tot-inv.paid>0?'var(--orange)':'var(--green)',fontWeight:600}}>{fmt(tot-inv.paid)}</td>
        <td><div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'flex-end'}}><span className="chip" style={{color:IC[inv.status],background:IC[inv.status]+'22'}}>{t('inv_'+inv.status)}</span>{role==='admin'&&inv.status!=='paid'?<React.Fragment><button className="iconbtn" title={t('sendReminder')} onClick={(e)=>{e.stopPropagation();toast('✉ '+t('reminderSent'));}}><I.send style={{width:15,height:15}}/></button><button className="btn green sm" onClick={(e)=>{e.stopPropagation();setPay(inv);}}>{t('markPaidShort')}</button></React.Fragment>:null}</div></td></tr>;})}</tbody></table></div>
    {pay?<MarkPaidModal inv={pay} close={()=>setPay(null)} onSaved={()=>{setPay(null);force(x=>x+1);}} toast={toast}/>:null}
    {gen&&<InvoiceGen close={()=>setGen(false)} open={(inv)=>{setGen(false);setView(inv);}} />}
  </div>;
}
function InvoiceGen({close,open}){
  const{t}=useT();const[proj,setProj]=useState(PROJECTS[0].id);
  const p=PROJECTS.find(x=>x.id==proj);
  const items=[];p.songs.forEach(s=>{if(s.master)items.push({desc:`${s.name} — ${t('master')}`,qty:1,rate:p.pricing.masterPrice});if(s.stems)items.push({desc:`${s.name} — ${t('stems')}`,qty:1,rate:p.pricing.stemsPrice});});
  const draft={number:"IM-2026-00"+(45+p.id),clientName:p.clientName,project:p.title,status:"draft",issued:"Jun 30",due:"Jul 14",paid:0,items};
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('generateInvoice')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:18}}>Pre-filled with {COMPANY.name} details and master/stems pricing.</p>
    <div className="field"><label>{t('nav_projects')}</label><select value={proj} onChange={e=>setProj(e.target.value)}>{PROJECTS.map(x=><option key={x.id} value={x.id}>{x.title} · {x.clientName}</option>)}</select></div>
    <div style={{background:'var(--sep)',borderRadius:12,padding:'12px 14px',marginBottom:8}}>{items.map((it,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'5px 0'}}><span>{it.desc}</span><b>{fmt(it.qty*it.rate)}</b></div>)}
      <div style={{display:'flex',justifyContent:'space-between',fontSize:14,paddingTop:8,borderTop:'1px solid var(--sep-strong)',marginTop:4}}><b>{t('total')}</b><b>{fmt(items.reduce((a,it)=>a+it.qty*it.rate,0))}</b></div></div>
    <div style={{display:'flex',gap:10,marginTop:14}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn" style={{flex:1,justifyContent:'center'}} onClick={()=>open(draft)}>{t('generateInvoice')}</button></div>
  </div></div>;
}
function InvoiceView({inv,back,toast}){
  const{t}=useT();const tot=invTotal(inv);
  return <div className="view content narrow">
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:18,gap:10,flexWrap:'wrap'}}><button className="btn ghost sm" onClick={back}><I.back style={{width:15,height:15}}/>{t('invoicesTitle')}</button>
      <div style={{display:'flex',gap:8}}><button className="btn ghost sm" onClick={()=>toast(t('download'))}><I.down style={{width:14,height:14}}/>{t('download')}</button><button className="btn sm" onClick={()=>toast('✓ '+t('send'))}><I.send style={{width:14,height:14}}/>{t('send')}</button></div></div>
    <div className="invoice">
      <div className="ihead"><div><div style={{width:48,height:48,borderRadius:13,background:'linear-gradient(135deg,#5e5ce6,#0a84ff 55%,#ff2d55)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}><I.note style={{width:24,height:24,color:'#fff'}}/></div>
        <b style={{fontSize:18}}>{COMPANY.name}</b><div style={{color:'#8e8e93',fontSize:12,marginTop:4,lineHeight:1.6}}>{COMPANY.address}<br/>{COMPANY.taxId}<br/>{COMPANY.email}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:26,fontWeight:720,letterSpacing:'-0.02em'}}>INVOICE</div><div className="mono" style={{color:'#8e8e93',fontSize:13,marginTop:4}}>{inv.number}</div>
          <div style={{marginTop:10,fontSize:12,color:'#8e8e93'}}>{t('issued')}: {inv.issued}<br/>{t('dueDate')}: {inv.due}</div></div></div>
      <div style={{fontSize:12,color:'#8e8e93',marginBottom:2}}>{t('billTo')}</div><b style={{fontSize:15}}>{inv.clientName}</b>
      <table><thead><tr><th>{t('description')}</th><th style={{textAlign:'center'}}>{t('qty')}</th><th style={{textAlign:'right'}}>{t('rate')}</th><th style={{textAlign:'right'}}>{t('amount')}</th></tr></thead>
        <tbody>{inv.items.map((it,i)=><tr key={i}><td>{it.desc}</td><td style={{textAlign:'center'}}>{it.qty}</td><td style={{textAlign:'right'}}>{fmt(it.rate)}</td><td style={{textAlign:'right',fontWeight:600}}>{fmt(it.qty*it.rate)}</td></tr>)}</tbody></table>
      <div style={{display:'flex',justifyContent:'flex-end'}}><div style={{width:240}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'6px 0'}}><span style={{color:'#8e8e93'}}>{t('subtotal')}</span><span>{fmt(tot)}</span></div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'6px 0'}}><span style={{color:'#8e8e93'}}>{t('paid')}</span><span>{fmt(inv.paid)}</span></div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:16,fontWeight:720,padding:'10px 0',borderTop:'2px solid #1d1d1f',marginTop:4}}><span>{t('balance')}</span><span>{fmt(tot-inv.paid)}</span></div></div></div>
    </div>
  </div>;
}

/* ===== PAYMENTS ===== */
function Payments({role,toast}){
  const{t}=useT();
  if(role==='artist'){const mine=PAYOUTS.filter(p=>p.artist==='Nova Reyes');const PSc={pending:"#ff9f0a",scheduled:"#0a84ff",paid:"#34c759"};
    return <div className="view content narrow"><div className="h-row"><div><h1>{t('nav_earnings')}</h1><p>Your payouts. Client identity stays hidden.</p></div></div>
      <div className="grid stagger" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:20}}>
        <div className="card stat"><div className="lab">{t('payout_pending')}</div><div className="val">{fmt(mine.filter(p=>p.status==='pending').reduce((a,p)=>a+p.amount,0))}</div></div>
        <div className="card stat"><div className="lab">{t('payout_scheduled')}</div><div className="val">{fmt(mine.filter(p=>p.status==='scheduled').reduce((a,p)=>a+p.amount,0))}</div></div>
        <div className="card stat"><div className="lab">{t('payout_paid')}</div><div className="val">{fmt(mine.filter(p=>p.status==='paid').reduce((a,p)=>a+p.amount,0))}</div></div></div>
      <div className="card solid" style={{padding:'8px 8px'}}><table className="tbl"><thead><tr><th>{t('nav_projects')}</th><th>{t('amount')}</th><th>{t('status')}</th></tr></thead>
        <tbody>{mine.map((p,i)=><tr key={i}><td style={{fontWeight:600}}>{p.project}</td><td>{fmt(p.amount)}</td><td><span className="chip" style={{color:PSc[p.status],background:PSc[p.status]+'22'}}>{t('payout_'+p.status)}</span></td></tr>)}</tbody></table></div></div>;
  }
  const recv=INVOICES.map(i=>({...i,bal:invTotal(i)-i.paid})).filter(i=>i.bal>0);
  const collected=INVOICES.reduce((a,i)=>a+i.paid,0);const outstanding=INVOICES.reduce((a,i)=>a+(invTotal(i)-i.paid),0);const topay=PAYOUTS.filter(p=>p.status!=='paid').reduce((a,p)=>a+p.amount,0);
  const PSc={pending:"#ff9f0a",scheduled:"#0a84ff",paid:"#34c759"};
  const stages=[['inv_draft','draft'],['inv_sent','sent'],['inv_partial','partial'],['inv_paid','paid']];
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('paymentsTitle')}</h1><p>Receivables, payouts and the overall financial pipeline.</p></div></div>
    <div className="grid stagger" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:22}}>
      <div className="card stat"><div className="lab"><span className="si" style={{background:'rgba(52,199,89,.2)',color:'var(--green)'}}><I.dollar style={{width:15,height:15}}/></span>{t('collected')}</div><div className="val">{fmt(collected)}</div></div>
      <div className="card stat"><div className="lab"><span className="si" style={{background:'rgba(255,159,10,.2)',color:'var(--orange)'}}><I.receipt style={{width:15,height:15}}/></span>{t('outstanding')}</div><div className="val">{fmt(outstanding)}</div></div>
      <div className="card stat"><div className="lab"><span className="si" style={{background:'rgba(94,92,230,.2)',color:'var(--accent-2)'}}><I.users style={{width:15,height:15}}/></span>{t('toPay')}</div><div className="val">{fmt(topay)}</div></div></div>
    <b style={{fontSize:15,display:'block',marginBottom:10}}>{t('financialPipeline')}</b>
    <div className="pipeline" style={{marginBottom:24}}>{stages.map(([lab,st])=>{const items=INVOICES.filter(i=>i.status===st);const IC={draft:"#8e8e93",sent:"#0a84ff",partial:"#ff9f0a",paid:"#34c759"};return <div className="pipecol" key={st}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,fontSize:13,fontWeight:650}}><span className="pdot" style={{width:9,height:9,borderRadius:'50%',background:IC[st]}}/>{t(lab)}<span style={{marginLeft:'auto',color:'var(--text-3)',fontSize:12}}>{fmt(items.reduce((a,i)=>a+invTotal(i),0))}</span></div>
      {items.map(i=><div key={i.id} style={{background:'var(--card-solid)',border:'1px solid var(--sep)',borderRadius:11,padding:'10px 12px',marginBottom:8}}><div style={{fontWeight:600,fontSize:13}}>{i.clientName}</div><div style={{fontSize:11.5,color:'var(--text-3)'}}>{i.project}</div><div style={{fontWeight:700,fontSize:14,marginTop:4}}>{fmt(invTotal(i))}</div></div>)}
      {items.length===0&&<div style={{fontSize:12,color:'var(--text-3)',textAlign:'center',padding:'8px'}}>—</div>}</div>;})}</div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr',alignItems:'start'}}>
      <div className="card solid" style={{padding:'8px 8px'}}><div style={{padding:'10px 14px',fontWeight:650,fontSize:14}}>{t('receivables')}</div><table className="tbl"><tbody>{recv.map(i=><tr key={i.id}><td><div style={{fontWeight:600}}>{i.clientName}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{i.number}</div></td><td style={{textAlign:'right',fontWeight:600,color:'var(--orange)'}}>{fmt(i.bal)}</td></tr>)}</tbody></table></div>
      <div className="card solid" style={{padding:'8px 8px'}}><div style={{padding:'10px 14px',fontWeight:650,fontSize:14}}>{t('whoToPay')}</div><table className="tbl"><tbody>{PAYOUTS.map((p,i)=><tr key={i}><td><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={p.artist} i={p.i} size={32}/><div><div style={{fontWeight:600}}>{p.artist}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{p.project}</div></div></div></td>
        <td style={{textAlign:'right',fontWeight:600}}>{fmt(p.amount)}</td>
        <td style={{textAlign:'right'}}>{p.status==='paid'?<span className="chip" style={{color:'var(--green)',background:'rgba(52,199,89,.14)'}}>{t('payout_paid')}</span>:<button className="btn ghost sm" onClick={()=>toast('✓ '+t('markPaid'))}>{t('markPaid')}</button>}</td></tr>)}</tbody></table></div>
    </div>
  </div>;
}
/* ===== USERS & PERMISSIONS ===== */
function Users({toast}){
  const{t}=useT();const modKeys=['projects','files','comments','chat','deliveries','users','finance'];
  const levels=['lvl_none','lvl_view','lvl_comment','lvl_approve','lvl_edit','lvl_admin'];
  const seed={Client:[1,3,2,2,3,0,1],Artist:[1,4,2,2,4,0,1],Admin:[5,5,5,5,5,5,5]};
  const[sel,setSel]=useState('Client');const[grid,setGrid]=useState(seed);
  const people=[{name:"Nova Reyes",role:"Artist",i:0,projects:2},{name:"Theo Park",role:"Artist",i:2,projects:1},{name:"Lunar Records",role:"Client",i:1,projects:1},{name:"Sunset Collective",role:"Client",i:3,projects:2},{name:"You (Admin)",role:"Admin",i:5,projects:5}];
  const colors=['#8e8e93','#0a84ff','#34c759','#34c759','#ff9f0a','#5e5ce6'];
  const cycle=(mi)=>{const g={...grid};g[sel]=[...g[sel]];g[sel][mi]=(g[sel][mi]+1)%6;setGrid(g);};
  const rl={Client:'role_client',Artist:'role_artist',Admin:'role_admin'};
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('usersTitle')}</h1><p>Custom permissions without new account types.</p></div><button className="btn" onClick={()=>toast('✓ '+t('inviteUser'))}><I.plus style={{width:16,height:16}}/>{t('inviteUser')}</button></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1.4fr',alignItems:'start'}}>
      <div className="card solid" style={{padding:'8px 8px'}}><div style={{padding:'10px 14px',fontSize:13,fontWeight:600,color:'var(--text-2)'}}>{t('people')} ({people.length})</div>
        {people.map((u,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:12,cursor:'pointer',background:sel===u.role?'var(--sep)':'',transition:'background .15s'}} onClick={()=>setSel(u.role)}>
          <Avatar name={u.name} i={u.i}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{u.name}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{t(rl[u.role])} · {u.projects} {t('projectsCount')}</div></div></div>)}</div>
      <div className="card solid" style={{padding:'18px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}><b style={{fontSize:15}}>{t('permMatrix')} · <span style={{color:'var(--accent)'}}>{t(rl[sel])}</span></b><button className="btn ghost sm" onClick={()=>toast('✓ '+t('save'))}>{t('save')}</button></div>
        <p style={{fontSize:12.5,color:'var(--text-3)',marginBottom:14}}>{t('permHint')}</p>
        <table className="tbl permtable"><tbody>{modKeys.map((m,mi)=>{const lvl=grid[sel][mi];return <tr key={mi} onClick={()=>cycle(mi)} style={{cursor:'pointer'}}><td style={{fontWeight:560}}>{t('mod_'+m)}</td><td><span className="pill" style={{color:lvl?colors[lvl]:'var(--text-3)',background:lvl?colors[lvl]+'22':'var(--sep)'}}><span className="pdot" style={{background:lvl?colors[lvl]:'var(--text-3)'}}/>{t(levels[lvl])}</span></td></tr>;})}</tbody></table>
        <div style={{marginTop:14,padding:'12px 14px',background:'rgba(94,92,230,.1)',borderRadius:12,fontSize:12.5,color:'var(--accent-2)',display:'flex',gap:9,alignItems:'flex-start'}}><I.shield style={{width:16,height:16,flex:'0 0 16px',marginTop:1}}/>{sel==='Client'?'Clients never see artist data. Communication only via moderated chat.':sel==='Artist'?'Artists never see client identity. Limited to necessary files.':'Full system access and audit.'}</div>
      </div>
    </div>
  </div>;
}

/* ===== SETTINGS ===== */
function Settings({lang,setLang,theme,setTheme,toast,isSuper,role}){
  const{t}=useT();
  return <div className="view content narrow" style={{maxWidth:820}}>
    <div className="h-row"><div><h1>{t('settingsTitle')}</h1></div></div>
    <div className="card solid" style={{padding:'22px 24px',marginBottom:18}}>
      <b style={{fontSize:16,display:'flex',alignItems:'center',gap:9}}><I.globe style={{width:18,height:18,color:'var(--accent)'}}/>{t('language')}</b>
      <p style={{fontSize:13,color:'var(--text-2)',margin:'4px 0 16px'}}>{t('languageSub')}</p>
      {LANGS.map(l=><div key={l.c} className={"langrow"+(lang===l.c?' on':'')} onClick={()=>setLang(l.c)}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:22}}>{l.flag}</span><div><div style={{fontWeight:600,fontSize:14.5}}>{l.native}</div><div style={{fontSize:12,color:'var(--text-3)'}}>{l.name}{l.c==='en'?' · Default':''}</div></div></div>
        {lang===l.c?<span style={{width:24,height:24,borderRadius:'50%',background:'var(--accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><I.check style={{width:14,height:14}}/></span>:<span style={{width:24,height:24,borderRadius:'50%',border:'1.5px solid var(--sep-strong)'}}/>}</div>)}
    </div>
    <div className="card solid" style={{padding:'22px 24px',marginBottom:18}}>
      <b style={{fontSize:16,display:'flex',alignItems:'center',gap:9}}><I.settings style={{width:18,height:18,color:'var(--accent-2)'}}/>{t('companyInfo')}</b>
      <p style={{fontSize:13,color:'var(--text-2)',margin:'4px 0 16px'}}>{t('companySub')}</p>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="field"><label>{t('legalName')}</label><input defaultValue={COMPANY.name}/></div>
        <div className="field"><label>{t('email')}</label><input defaultValue={COMPANY.email}/></div>
        <div className="field" style={{gridColumn:'1/3'}}><label>{t('address')}</label><input defaultValue={COMPANY.address} placeholder="123 Studio Ave, City, Country"/></div>
        <div className="field"><label>{t('taxId')}</label><input defaultValue={COMPANY.taxId} placeholder="e.g. EIN / VAT"/></div>
        <div className="field"><label>{t('signatory')}</label><input defaultValue={COMPANY.signatory}/></div>
        <div className="field"><label>{t('currency')}</label><select><option>USD ($)</option><option>VND (₫)</option><option>INR (₹)</option></select></div>
      </div>
      <button className="btn" style={{marginTop:6}} onClick={()=>toast('✓ '+t('saveChanges'))}>{t('saveChanges')}</button>
    </div>
    <div className="card solid" style={{padding:'22px 24px'}}>
      <b style={{fontSize:16,display:'flex',alignItems:'center',gap:9}}>{theme==='dark'?<I.moon style={{width:18,height:18,color:'var(--orange)'}}/>:<I.sun style={{width:18,height:18,color:'var(--orange)'}}/>}{t('appearance')}</b>
      <div className="seg" style={{marginTop:14}}><button className={theme!=='dark'?'on':''} onClick={()=>setTheme('light')}><I.sun style={{width:14,height:14,display:'inline',verticalAlign:'-2px',marginRight:6}}/>{t('lightMode')}</button><button className={theme==='dark'?'on':''} onClick={()=>setTheme('dark')}><I.moon style={{width:14,height:14,display:'inline',verticalAlign:'-2px',marginRight:6}}/>{t('darkMode')}</button></div>
    </div>
    {role==='admin'?<RemindersCard toast={toast}/>:null}
    {isSuper?<LoginCustomizer toast={toast}/>:null}
  </div>;
}

/* ===== CALENDAR ===== */
function Calendar(){
  const{t}=useT();const days=['M','T','W','T','F','S','S'];
  const events={3:[{t:'Midnight Bloom',c:'#ff9f0a'}],2:[{t:'Velvet Skies',c:'#ff3b30'}],12:[{t:'Golden Hour',c:'#0a84ff'}],4:[{t:'Midnight Bloom',c:'#ff9f0a'}]};
  return <div className="view content narrow"><div className="h-row"><div><h1>{t('calTitle')}</h1><p>{t('calSub')}</p></div></div>
    <div className="card solid" style={{padding:22}}><div className="grid" style={{gridTemplateColumns:'repeat(7,1fr)',gap:8}}>
      {days.map((d,i)=><div key={i} style={{textAlign:'center',fontSize:12,fontWeight:600,color:'var(--text-3)',paddingBottom:6}}>{d}</div>)}
      {Array.from({length:35}).map((_,i)=>{const day=i-1;const valid=day>=1&&day<=31;const ev=events[day];return <div key={i} style={{minHeight:84,borderRadius:12,border:'1px solid var(--sep)',padding:8,background:valid?'var(--bg-solid)':'transparent',opacity:valid?1:.3}}>
        {valid&&<div style={{fontSize:12.5,fontWeight:day===30?700:540,color:day===30?'var(--accent)':'var(--text-2)'}}>{day}</div>}
        {ev&&ev.map((e,j)=><div key={j} style={{marginTop:4,fontSize:10.5,fontWeight:600,color:'#fff',background:e.c,borderRadius:6,padding:'2px 6px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.t}</div>)}</div>;})}</div></div></div>;
}

/* ===== NEW PROJECT ===== */
function NewProject({close,toast}){
  const{t}=useT();const[type,setType]=useState('persong');
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('newProject')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:18}}>Assign artist and client. Their identities stay hidden from each other. A Drive folder and MOU are created automatically.</p>
    <div className="field"><label>{t('title')}</label><input placeholder="e.g. Midnight Bloom"/></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="field"><label>{t('artistF')}</label><select><option>Nova Reyes (0xA4)</option><option>Theo Park (0xB7)</option><option>Mika Sol (0xC2)</option></select></div>
      <div className="field"><label>{t('clientF')}</label><select>{CLIENTS.map(c=><option key={c.code}>{c.name}</option>)}</select></div></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="field"><label>{t('priority')}</label><select><option>{t('pr_medium')}</option><option>{t('pr_low')}</option><option>{t('pr_high')}</option><option>{t('pr_urgent')}</option></select></div>
      <div className="field"><label>{t('deliveryDate')}</label><input type="date"/></div></div>
    <div className="field"><label>{t('budget')}</label><div className="seg" style={{width:'100%'}}><button className={type==='persong'?'on':''} style={{flex:1}} onClick={()=>setType('persong')}>{t('perSong')}</button><button className={type==='total'?'on':''} style={{flex:1}} onClick={()=>setType('total')}>{t('total')}</button></div></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}><div className="field"><label>{t('master')} ($)</label><input type="number" defaultValue="900"/></div><div className="field"><label>{t('stems')} ($)</label><input type="number" defaultValue="300"/></div></div>
    <div style={{display:'flex',gap:10,marginTop:8}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn" style={{flex:1,justifyContent:'center'}} onClick={()=>{close();toast('✓ '+t('create')+' · Drive + MOU ready');}}>{t('create')}</button></div>
  </div></div>;
}

/* ===== COMMAND PALETTE ===== */
function CommandPalette({close,go,setTheme,theme,nav}){
  const{t}=useT();const[q,setQ]=useState('');const[sel,setSel]=useState(0);
  const navCmds=nav.map(([k,ic,l])=>({ic,t:l,a:()=>go(k)}));
  const cmds=[...navCmds,...PROJECTS.map(p=>({ic:'note',t:`${t('nav_projects')}: ${p.title}`,a:()=>go('project',p)})),{ic:theme==='dark'?'sun':'moon',t:theme==='dark'?t('lightMode'):t('darkMode'),a:()=>setTheme(theme==='dark'?'light':'dark')}];
  const filtered=cmds.filter(c=>c.t.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>{const h=(e)=>{if(e.key==='ArrowDown'){e.preventDefault();setSel(s=>Math.min(s+1,filtered.length-1));}if(e.key==='ArrowUp'){e.preventDefault();setSel(s=>Math.max(s-1,0));}if(e.key==='Enter'){filtered[sel]&&filtered[sel].a();close();}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[filtered,sel]);
  return <div className="overlay" onClick={close}><div className="cmdk" onClick={e=>e.stopPropagation()}>
    <div className="cin"><I.search style={{width:20,height:20,color:'var(--text-3)'}}/><input autoFocus placeholder={t('searchHint')} value={q} onChange={e=>{setQ(e.target.value);setSel(0);}}/><kbd style={{fontSize:11,color:'var(--text-3)'}}>esc</kbd></div>
    <div style={{maxHeight:340,overflowY:'auto',padding:'6px 0'}}>{filtered.length?filtered.map((c,i)=><div key={i} className={"cmdrow"+(i===sel?' sel':'')} onMouseEnter={()=>setSel(i)} onClick={()=>{c.a();close();}}><span className="ci">{I[c.ic]?I[c.ic]({style:{width:16,height:16}}):<I.note style={{width:16,height:16}}/>}</span>{c.t}{i===sel&&<I.arrow style={{width:16,height:16,marginLeft:'auto'}}/>}</div>):<div className="empty" style={{padding:'30px'}}>{t('noResults')}</div>}</div>
  </div></div>;
}
//SENTINEL_COMPONENTS
/* ===== APP SHELL ===== */

/* ===== LOGIN BACKDROP (animated premium overlay) ===== */
function LoginBackdrop({cfg}){
  cfg=cfg||LOGIN_DEFAULT;
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c||!cfg.ov.particles) return; const ctx=c.getContext('2d'); if(!ctx) return; let raf,W,H,dpr;
    const P=[]; const N=(window.innerWidth<640)?24:46;
    function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    function seed(){P.length=0;for(let i=0;i<N;i++){P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+0.5,vx:(Math.random()-.5)*0.16,vy:(Math.random()-.5)*0.16,a:Math.random()*0.45+0.18});}}
    function tick(){ctx.clearRect(0,0,W,H);for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;const R=p.r*7;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R);g.addColorStop(0,'rgba(255,255,255,'+p.a+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,R,0,7);ctx.fill();}raf=requestAnimationFrame(tick);}
    resize();seed();tick();
    const onR=()=>{resize();seed();};window.addEventListener('resize',onR);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onR);};
  },[]);
  const dur=(base)=>(((140-cfg.speed)/70)*base).toFixed(1)+'s';
  const ovOp=cfg.intensity/100;
  const lights=cfg.ov.lights||cfg.ov.animGradient;
  return <div className="login-bg" aria-hidden="true">
    {cfg.bg==='customGradient'?<div className="login-media" style={{background:`linear-gradient(135deg,${cfg.gFrom},${cfg.gVia} 50%,${cfg.gTo})`,opacity:cfg.opacity/100}}/>:null}
    {cfg.bg==='image'&&cfg.mediaUrl?<div className="login-media" style={{backgroundImage:`url("${cfg.mediaUrl}")`,backgroundSize:cfg.fit,backgroundPosition:'center',opacity:cfg.opacity/100}}/>:null}
    {cfg.bg==='video'&&cfg.mediaUrl?<video className="login-media" src={cfg.mediaUrl} autoPlay muted loop={cfg.loop} playsInline style={{objectFit:cfg.fit,opacity:cfg.opacity/100}}/>:null}
    {lights?<React.Fragment><div className="aurora a1" style={{opacity:ovOp*.9,animationDuration:dur(22)}}/><div className="aurora a2" style={{opacity:ovOp*.9,animationDuration:dur(26)}}/><div className="aurora a3" style={{opacity:ovOp*.5,animationDuration:dur(30)}}/></React.Fragment>:null}
    {cfg.ov.blur?<div className="login-blur"/>:null}
    {cfg.ov.particles?<canvas ref={ref} className="login-particles" style={{opacity:Math.min(1,ovOp+.25)}}/>:null}
    {cfg.ov.grain?<div className="login-grain" style={{opacity:ovOp*.6}}/>:null}
  </div>;
}

/* ===== CLIENT · MY FILES ===== */
const SERVICE_OF=(p)=>{const hasM=p.songs.some(s=>s.master),hasS=p.songs.some(s=>s.stems);return hasM&&hasS?'Mixing & Mastering':hasM?'Mastering':'Production';};
const DL_OPTS=[['project','Project Files','contract'],['masters','Masters','disc'],['stems','Stems','layers'],['mastersstems','Masters & Stems','note'],['all','All available files','folder']];
function DownloadSelector({p,close,toast}){
  const{t}=useT();const[sel,setSel]=useState(null);
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
    <h2 style={{fontSize:20,fontWeight:700,marginBottom:2}}>{t('downloadFiles')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:16}}>{p.title} · {SERVICE_OF(p)}</p>
    <div className="dl-opts">{DL_OPTS.map(([k,label,ic])=><button key={k} className={"dl-opt"+(sel===k?' on':'')} onClick={()=>setSel(k)}>
      <span className="dl-ic">{I[ic]({style:{width:18,height:18}})}</span><span style={{flex:1,textAlign:'left',fontWeight:560}}>{label}</span>
      <span className="dl-check">{sel===k?<I.check style={{width:15,height:15}}/>:null}</span></button>)}</div>
    <div style={{display:'flex',gap:10,marginTop:18}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button>
      <button className="btn" style={{flex:1,justifyContent:'center',opacity:sel?1:.5}} disabled={!sel} onClick={()=>{const lab=DL_OPTS.find(o=>o[0]===sel)[1];close();toast('⬇ '+t('preparing')+' · '+lab);}}>{t('download')}</button></div>
  </div></div>;
}
function MyFiles({role,toast}){
  const{t}=useT();const[dl,setDl]=useState(null);
  const list=myProjects('client');
  return <div className="view content">
    <div className="h-row"><div><h1 style={{display:'flex',alignItems:'center',gap:10}}><I.folder style={{width:26,height:26,color:'var(--accent)'}}/>{t('myFilesTitle')}</h1><p>{t('myFilesSub')}</p></div></div>
    {list.length===0?<div className="empty">{t('noFilesYet')}</div>:
    <div className="mf-grid stagger">{list.map(p=><div className="mf-card" key={p.id}>
      <Cover grad={p.grad} height={66}/>
      <div className="mf-body">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}><b style={{fontSize:16}}>{p.title}</b><Pill s={p.status}/></div>
        <div className="mf-meta"><span><I.cal style={{width:13,height:13}}/>{p.due}</span><span><I.disc style={{width:13,height:13}}/>{SERVICE_OF(p)}</span></div>
        <div className="mf-actions"><button className="btn ghost sm" style={{flex:1,justifyContent:'center'}} onClick={()=>{if(p.driveUrl){window.open(p.driveUrl,'_blank');}else{toast(t('driveSoon'));}}}><I.drive style={{width:15,height:15,color:'var(--green)'}}/>{t('openInDrive')}</button>
          <button className="btn sm" style={{flex:1,justifyContent:'center'}} onClick={()=>setDl(p)}><I.down style={{width:15,height:15}}/>{t('download')}</button></div>
      </div>
    </div>)}</div>}
    {dl?<DownloadSelector p={dl} close={()=>setDl(null)} toast={toast}/>:null}
  </div>;
}

/* ===== CLIENT · INVOICES (pending-focused) ===== */
const _MONTHS={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function parseDue(s){const parts=(s||'').split(' ');return new Date(2026,_MONTHS[parts[0]]||0,parseInt(parts[1])||1);}
const TODAY=new Date(2026,6,18);
function ClientInvoices({toast}){
  const{t}=useT();const[view,setView]=useState(null);const[showHist,setShowHist]=useState(false);
  const all=INVOICES.filter(i=>i.clientName==='Lunar Records');
  const isPaid=(i)=>i.status==='paid'||(invTotal(i)-i.paid)<=0;
  const pending=all.filter(i=>!isPaid(i));const history=all.filter(isPaid);
  if(view)return <InvoiceView inv={view} back={()=>setView(null)} toast={toast}/>;
  const Row=(inv)=>{const tot=invTotal(inv);const bal=tot-inv.paid;const over=bal>0&&parseDue(inv.due)<TODAY;
    return <div className={"ci-card"+(over?' overdue':'')} key={inv.id}>
      <div className="ci-main">
        <div className="ci-num"><b className="mono">{inv.number}</b><span>{inv.project}</span></div>
        <div className="ci-amt"><b>{fmt(bal>0?bal:tot)}</b><small>USD</small></div>
      </div>
      <div className="ci-meta">
        <span><I.cal style={{width:13,height:13}}/>{t('created')} {inv.issued}</span>
        <span className={over?'ci-over':''}><I.clock style={{width:13,height:13}}/>{over?(t('overdue')+' · '+inv.due):(t('dueDate')+' '+inv.due)}</span>
        {over?<span className="ci-badge over">{t('overdue')}</span>:<span className="ci-badge">{t('inv_'+inv.status)}</span>}
      </div>
      <div className="ci-act"><button className="btn ghost sm" onClick={()=>setView(inv)}><I.receipt style={{width:14,height:14}}/>{t('openInvoice')}</button>
        <button className="btn ghost sm" onClick={()=>toast('⬇ '+t('download'))}><I.down style={{width:14,height:14}}/>{t('download')}</button></div>
    </div>;};
  return <div className="view content narrow">
    <div className="h-row"><div><h1>{t('invoicesTitle')}</h1><p>{t('invClientSub')}</p></div></div>
    <div className="ci-sec-label">{t('invPending')} · {pending.length}</div>
    {pending.length===0?<div className="empty">{t('noPending')}</div>:<div className="ci-list stagger">{pending.map(Row)}</div>}
    {history.length>0?<div style={{marginTop:22}}><button className="ci-hist-toggle" onClick={()=>setShowHist(v=>!v)}>{showHist?<I.chevD style={{width:16,height:16}}/>:<I.chevR style={{width:16,height:16}}/>}{t('invHistory')} · {history.length}</button>
      {showHist?<div className="ci-list stagger" style={{marginTop:12,opacity:.82}}>{history.map(Row)}</div>:null}</div>:null}
  </div>;
}

/* ===== ACCOUNTING (admin / super admin) ===== */
const ACCT_MONTHS=[{m:'Feb',in:8200,out:3100},{m:'Mar',in:10600,out:3800},{m:'Apr',in:9400,out:4200},{m:'May',in:12800,out:4600},{m:'Jun',in:15200,out:5100},{m:'Jul',in:14200,out:5600}];
function AcctBars({data,h=190}){
  const max=Math.max.apply(null,data.map(d=>Math.max(d.a,d.b)).concat([1]));
  return <div className="ac-bars" style={{height:h}}>{data.map((d,i)=><div className="ac-barcol" key={i}>
    <div className="ac-barpair">
      <div className="ac-bar in" style={{height:(d.a/max*100)+'%',animationDelay:(i*0.06)+'s'}}/>
      <div className="ac-bar out" style={{height:(d.b/max*100)+'%',animationDelay:(i*0.06+0.03)+'s'}}/>
    </div><span className="ac-blabel">{d.label}</span></div>)}</div>;
}
function AcctArea({pts,h=160,color='#0a84ff'}){
  const w=520;const max=Math.max.apply(null,pts.concat([1]));const min=Math.min.apply(null,pts.concat([0]));const rng=(max-min)||1;const step=w/((pts.length-1)||1);
  const xy=pts.map((v,i)=>[i*step,h-8-((v-min)/rng)*(h-24)]);
  const line=xy.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=line+' L '+w+' '+h+' L 0 '+h+' Z';
  return <svg className="ac-area" viewBox={'0 0 '+w+' '+h} preserveAspectRatio="none">
    <defs><linearGradient id="acg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.28"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <path d={area} fill="url(#acg)" className="ac-areafill"/>
    <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ac-arealine"/>
  </svg>;
}
function AcctDonut({paid,pending,overdue}){
  const tot=paid+pending+overdue||1;const R=54,C=2*Math.PI*R;
  const seg=(v,off,col)=>{const len=v/tot*C;return <circle cx="70" cy="70" r={R} fill="none" stroke={col} strokeWidth="18" strokeDasharray={len+' '+(C-len)} strokeDashoffset={-off} transform="rotate(-90 70 70)"/>;};
  return <svg width="140" height="140" viewBox="0 0 140 140" className="ac-donut-svg"><circle cx="70" cy="70" r={R} fill="none" stroke="var(--sep)" strokeWidth="18"/>
    {seg(paid,0,'#34c759')}{seg(pending,paid/tot*C,'#ff9f0a')}{seg(overdue,(paid+pending)/tot*C,'#ff3b30')}
    <text x="70" y="66" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text)">{Math.round(paid/tot*100)}%</text>
    <text x="70" y="83" textAnchor="middle" fontSize="9" letterSpacing="1" fill="var(--text-3)">PAID</text></svg>;
}
function AcctHBars({rows,color}){
  const max=Math.max.apply(null,rows.map(r=>r.v).concat([1]));
  return <div className="ac-hbars">{rows.map((r,i)=><div className="ac-hrow" key={i}>
    <span className="ac-hlabel">{r.label}</span>
    <div className="ac-htrack"><div className="ac-hfill" style={{width:(r.v/max*100)+'%',background:color,animationDelay:(i*0.08)+'s'}}/></div>
    <span className="ac-hval">{fmt(r.v)}</span></div>)}</div>;
}
function Accounting({role}){
  const{t}=useT();const[period,setPeriod]=useState('month');const[client,setClient]=useState('all');const[status,setStatus]=useState('all');
  const inc=INVOICES.map(iv=>({client:iv.clientName,amount:invTotal(iv),paid:iv.paid,status:iv.status}));
  const fInc=inc.filter(x=>(client==='all'||x.client===client)&&(status==='all'||x.status===status));
  const outstanding=fInc.reduce((a,x)=>a+(x.amount-x.paid),0);
  const collected=fInc.reduce((a,x)=>a+x.paid,0);
  const overdue=INVOICES.filter(iv=>iv.status!=='paid'&&parseDue(iv.due)<TODAY&&(client==='all'||iv.clientName===client)).reduce((a,iv)=>a+(invTotal(iv)-iv.paid),0);
  const totalIn=ACCT_MONTHS.reduce((a,m)=>a+m.in,0),totalOut=ACCT_MONTHS.reduce((a,m)=>a+m.out,0),net=totalIn-totalOut;
  let bars=ACCT_MONTHS.map(m=>({label:m.m,a:m.in,b:m.out}));
  if(period==='quarter')bars=[{label:'Q1',a:ACCT_MONTHS.slice(0,3).reduce((s,m)=>s+m.in,0),b:ACCT_MONTHS.slice(0,3).reduce((s,m)=>s+m.out,0)},{label:'Q2',a:ACCT_MONTHS.slice(3).reduce((s,m)=>s+m.in,0),b:ACCT_MONTHS.slice(3).reduce((s,m)=>s+m.out,0)}];
  if(period==='year')bars=[{label:'2026',a:totalIn,b:totalOut}];
  if(period==='week')bars=[['W1',3200,1100],['W2',3800,1300],['W3',3600,1250],['W4',3600,1950]].map(x=>({label:x[0],a:x[1],b:x[2]}));
  if(period==='day')bars=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>({label:d,a:[520,610,480,720,900,300,240][i],b:[180,210,160,240,300,90,70][i]}));
  const netSeries=[];ACCT_MONTHS.reduce((p,m)=>{const v=p+(m.in-m.out);netSeries.push(v);return v;},0);
  const paidAmt=fInc.filter(x=>x.status==='paid').reduce((a,x)=>a+x.amount,0);
  const pendAmt=fInc.filter(x=>x.status!=='paid').reduce((a,x)=>a+(x.amount-x.paid),0);
  const byClient={};inc.forEach(x=>{byClient[x.client]=(byClient[x.client]||0)+x.amount;});
  const topClients=Object.keys(byClient).map(k=>({label:k,v:byClient[k]})).sort((a,b)=>b.v-a.v).slice(0,5);
  const bySvc=[{label:'Mixing & Mastering',v:21800},{label:'Mastering',v:12400},{label:'Production',v:9600}];
  const clients=['all'].concat(Object.keys(byClient));
  const kpis=[{label:t('moneyIn'),v:fmt(totalIn),c:'#34c759',ic:'down'},{label:t('moneyOut'),v:fmt(totalOut),c:'#ff3b30',ic:'up'},{label:t('pendingIncome'),v:fmt(outstanding),c:'#ff9f0a',ic:'clock'},{label:t('netBalance'),v:fmt(net),c:'#0a84ff',ic:'activity'},{label:t('inv_paid'),v:fmt(collected),c:'#5e5ce6',ic:'check'},{label:t('overdue'),v:fmt(overdue),c:'#ff2d55',ic:'bell'}];
  return <div className="view content">
    <div className="h-row"><div><h1 style={{display:'flex',alignItems:'center',gap:10}}><I.dollar style={{width:26,height:26,color:'var(--green)'}}/>{t('accounting')}</h1><p>{t('accountingSub')}</p></div></div>
    <div className="ac-filters">
      <div className="seg ac-period">{[['day',t('p_day')],['week',t('p_week')],['month',t('p_month')],['quarter',t('p_quarter')],['year',t('p_year')],['custom',t('p_custom')]].map(x=><button key={x[0]} className={period===x[0]?'on':''} onClick={()=>setPeriod(x[0])}>{x[1]}</button>)}</div>
      <select value={client} onChange={e=>setClient(e.target.value)}>{clients.map(c=><option key={c} value={c}>{c==='all'?t('allClients'):c}</option>)}</select>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">{t('allStatuses')}</option><option value="paid">{t('inv_paid')}</option><option value="sent">{t('inv_sent')}</option><option value="partial">{t('inv_partial')}</option></select>
      <select><option>USD ($)</option><option>VND (₫)</option><option>INR (₹)</option></select>
    </div>
    <div className="ac-kpis stagger">{kpis.map((k,i)=><div className="ac-kpi" key={i}><div className="ac-kpi-ic" style={{background:k.c+'22',color:k.c}}>{I[k.ic]({style:{width:18,height:18}})}</div><div><div className="ac-kpi-v">{k.v}</div><div className="ac-kpi-l">{k.label}</div></div></div>)}</div>
    <div className="ac-charts">
      <div className="card solid ac-chart-wide"><div className="ac-ch-head"><b>{t('incomeVsExpense')}</b><div className="ac-legend"><span><i style={{background:'#34c759'}}/>{t('moneyIn')}</span><span><i style={{background:'#ff3b30'}}/>{t('moneyOut')}</span></div></div><AcctBars data={bars}/></div>
      <div className="card solid"><div className="ac-ch-head"><b>{t('paidVsPending')}</b></div><div className="ac-donut-wrap"><AcctDonut paid={paidAmt} pending={pendAmt} overdue={overdue}/><div className="ac-donut-legend"><span><i style={{background:'#34c759'}}/>{t('inv_paid')} · {fmt(paidAmt)}</span><span><i style={{background:'#ff9f0a'}}/>{t('st_pending')} · {fmt(pendAmt)}</span><span><i style={{background:'#ff3b30'}}/>{t('overdue')} · {fmt(overdue)}</span></div></div></div>
      <div className="card solid ac-chart-wide"><div className="ac-ch-head"><b>{t('netEvolution')}</b><span className="ac-net-big">{fmt(net)}</span></div><AcctArea pts={netSeries}/></div>
      <div className="card solid"><div className="ac-ch-head"><b>{t('topClients')}</b></div><AcctHBars rows={topClients} color="#5e5ce6"/></div>
      <div className="card solid"><div className="ac-ch-head"><b>{t('revenueByService')}</b></div><AcctHBars rows={bySvc} color="#0a84ff"/></div>
    </div>
  </div>;
}

/* ===== MARK AS PAID (admin) ===== */
function MarkPaidModal({inv,close,onSaved,toast}){
  const{t}=useT();const[method,setMethod]=useState('Bank transfer');const[date,setDate]=useState('Jul 18, 2026');const[ref,setRef]=useState('');const[notes,setNotes]=useState('');
  const save=()=>{Object.assign(inv,{status:'paid',paid:invTotal(inv),payment:{date,method,reference:ref,notes,by:COMPANY.signatory}});toast('✓ '+t('markedPaid'));onSaved&&onSaved();};
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('markPaidTitle')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:16}}>{inv.number} · {fmt(invTotal(inv))}</p>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:12}}>
      <div className="field"><label>{t('paymentDate')}</label><input value={date} onChange={e=>setDate(e.target.value)}/></div>
      <div className="field"><label>{t('paymentMethod')}</label><select value={method} onChange={e=>setMethod(e.target.value)}><option>Bank transfer</option><option>Card</option><option>Cash</option><option>PayPal</option><option>Other</option></select></div>
      <div className="field" style={{gridColumn:'1/3'}}><label>{t('reference')}</label><input value={ref} onChange={e=>setRef(e.target.value)} placeholder="Transaction ID / receipt #"/></div>
      <div className="field" style={{gridColumn:'1/3'}}><label>{t('internalNotes')}</label><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional"/></div>
    </div>
    <div style={{fontSize:12,color:'var(--text-3)',margin:'2px 0 14px'}}>{t('recordedBy')}: {COMPANY.signatory}</div>
    <div style={{display:'flex',gap:10}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn green" style={{flex:1,justifyContent:'center'}} onClick={save}><I.check style={{width:15,height:15}}/>{t('markPaidShort')}</button></div>
  </div></div>;
}

/* ===== USER MANAGEMENT (admin / super admin) ===== */
const ROLE_META={superadmin:{label:'Super Admin',c:'#5e5ce6'},admin:{label:'Administrator',c:'#0a84ff'},client:{label:'Client',c:'#ff9f0a'},artist:{label:'Artist',c:'#34c759'}};
const SEED_USERS=[
  {id:1,name:'Donovan',email:'contact@fallenroses.net',role:'superadmin',active:true,i:5},
  {id:2,name:'Maya Chen',email:'maya@idealmusic.net',role:'admin',active:true,i:3},
  {id:3,name:'Lunar Records',email:'ops@lunarrecords.co',role:'client',active:true,i:1},
  {id:4,name:'Nova Reyes',email:'nova@ideal-music.net',role:'artist',active:true,i:0},
  {id:5,name:'Sunset Collective',email:'hi@sunsetco.fm',role:'client',active:false,i:2},
];
function InviteModal({isSuper,close,onInvite,toast}){
  const{t}=useT();const[email,setEmail]=useState('');const[role,setRole]=useState('artist');
  const roles=isSuper?['artist','client','admin','superadmin']:['artist','client','admin'];
  const link='dashboard.ideal-music.net/?onboard='+Math.random().toString(36).slice(2,10);
  return <div className="modal-sheet" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}>
    <h2 style={{fontSize:21,fontWeight:700,marginBottom:4}}>{t('inviteUser')}</h2>
    <p style={{fontSize:13,color:'var(--text-2)',marginBottom:16}}>{t('inviteSub')}</p>
    <div className="field"><label>{t('email')}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@email.com"/></div>
    <div className="field"><label>{t('role')}</label><div className="seg" style={{width:'100%',flexWrap:'wrap'}}>{roles.map(r=><button key={r} className={role===r?'on':''} style={{flex:1,minWidth:90}} onClick={()=>setRole(r)}>{ROLE_META[r].label}</button>)}</div></div>
    {role==='client'?<div className="inv-link"><I.globe style={{width:14,height:14}}/><span className="mono" style={{flex:1,overflow:'hidden',textOverflow:'ellipsis'}}>{link}</span><button className="btn ghost sm" onClick={()=>{try{navigator.clipboard.writeText('https://'+link);}catch(_){}toast(t('linkCopied'));}}>{t('copy')}</button></div>:null}
    <div style={{fontSize:12,color:'var(--text-3)',marginTop:8}}>{isSuper?t('permSuperNote'):t('permAdminNote')}</div>
    <div style={{display:'flex',gap:10,marginTop:16}}><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>{t('cancel')}</button><button className="btn" style={{flex:1,justifyContent:'center',opacity:email?1:.5}} disabled={!email} onClick={()=>onInvite({email,role})}><I.send style={{width:15,height:15}}/>{t('sendInvite')}</button></div>
  </div></div>;
}
function UsersManage({toast,isSuper}){
  const{t}=useT();const[users,setUsers]=useState(SEED_USERS);const[inv,setInv]=useState(false);
  const canManage=(u)=>isSuper||u.role!=='superadmin';
  const setRole=(id,role)=>setUsers(us=>us.map(u=>u.id===id?Object.assign({},u,{role}):u));
  const toggle=(id)=>setUsers(us=>us.map(u=>u.id===id?Object.assign({},u,{active:!u.active}):u));
  const roleOpts=isSuper?['artist','client','admin','superadmin']:['artist','client','admin'];
  return <div className="view content narrow" style={{maxWidth:920}}>
    <div className="h-row"><div><h1>{t('usersTitle')}</h1><p>{isSuper?t('permSuperNote'):t('permAdminNote')}</p></div>
      <button className="btn" onClick={()=>setInv(true)}><I.plus style={{width:16,height:16}}/>{t('inviteUser')}</button></div>
    <div className="card solid" style={{padding:'8px 8px'}}><table className="tbl"><thead><tr><th>{t('people')}</th><th>{t('role')}</th><th>{t('status')}</th><th></th></tr></thead>
      <tbody>{users.map(u=><tr key={u.id}>
        <td><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={u.name} i={u.i} size={34}/><div><b style={{fontSize:14}}>{u.name}</b><div style={{fontSize:12,color:'var(--text-3)'}}>{u.email}</div></div></div></td>
        <td>{canManage(u)?<select value={u.role} onChange={e=>setRole(u.id,e.target.value)} className="role-select">{(roleOpts.indexOf(u.role)<0?roleOpts.concat([u.role]):roleOpts).map(r=><option key={r} value={r}>{ROLE_META[r].label}</option>)}</select>:<span className="chip" style={{color:ROLE_META[u.role].c,background:ROLE_META[u.role].c+'22'}}>{ROLE_META[u.role].label}</span>}</td>
        <td><span className="chip" style={{color:u.active?'var(--green)':'var(--text-3)',background:u.active?'rgba(52,199,89,.14)':'var(--sep)'}}>{u.active?t('active'):t('inactive')}</span></td>
        <td style={{textAlign:'right'}}>{canManage(u)?<button className="btn ghost sm" onClick={()=>toggle(u.id)}>{u.active?t('deactivate'):t('activate')}</button>:<span style={{fontSize:11.5,color:'var(--text-3)'}}><I.lock style={{width:12,height:12,verticalAlign:'-2px'}}/> {t('superOnly')}</span>}</td></tr>)}</tbody></table></div>
    {inv?<InviteModal isSuper={isSuper} close={()=>setInv(false)} onInvite={(u)=>{setUsers(us=>us.concat([{id:Date.now(),name:u.email.split('@')[0],email:u.email,role:u.role,active:true,i:us.length%6}]));setInv(false);toast('✉ '+t('inviteSent'));}} toast={toast}/>:null}
  </div>;
}

/* ===== ONBOARDING (public invite link) ===== */
const COUNTRIES=['United States','Mexico','Vietnam','India','United Kingdom','Canada','Germany','France','Spain','Brazil','Japan','Australia','Other'];
const CURRENCIES=['USD ($)','EUR (€)','GBP (£)','MXN ($)','VND (₫)','INR (₹)','JPY (¥)','CAD ($)','AUD ($)'];
function Onboarding({token}){
  const{t}=useT();const[step,setStep]=useState(0);const[done,setDone]=useState(false);
  const[f,setF]=useState({name:'',company:'',email:'',phone:'',address:'',country:'United States',legalName:'',taxId:'',currency:'USD ($)',needInvoice:'yes',notes:''});
  const set=(k,v)=>setF(o=>Object.assign({},o,{[k]:v}));
  const finish=()=>{try{localStorage.setItem('im_onboard_'+(token||'demo'),JSON.stringify(f));}catch(_){}setDone(true);};
  if(done)return <div className="ob-wrap"><div className="ob-card ob-done"><div className="success-check" style={{background:'var(--green)',margin:'0 auto 8px'}}><I.check style={{width:30,height:30,color:'#fff'}}/></div><h1 style={{fontSize:26,fontWeight:720}}>{t('obDone')}</h1><p style={{color:'var(--text-2)',marginTop:8,lineHeight:1.5}}>{t('obDoneSub')}</p></div></div>;
  const steps=[t('obStep1'),t('obStep2'),t('obStep3')];
  return <div className="ob-wrap"><div className="ob-card">
    <div className="ob-head"><div className="brandmark" style={{width:52,height:52,borderRadius:15}}><img src="/logo-white.png" alt="" style={{width:'64%',height:'64%',objectFit:'contain'}}/></div><div><h1 style={{fontSize:22,fontWeight:720}}>{t('obTitle')}</h1><p style={{color:'var(--text-2)',fontSize:13.5}}>{t('obSub')}</p></div></div>
    <div className="ob-steps">{steps.map((s,i)=><div key={i} className={"ob-dot"+(i===step?' on':'')+(i<step?' done':'')}><span>{i<step?'✓':i+1}</span>{s}</div>)}</div>
    {step===0?<div className="ob-grid">
      <div className="field"><label>{t('obName')}</label><input value={f.name} onChange={e=>set('name',e.target.value)}/></div>
      <div className="field"><label>{t('obCompany')}</label><input value={f.company} onChange={e=>set('company',e.target.value)}/></div>
      <div className="field"><label>{t('email')}</label><input type="email" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
      <div className="field"><label>{t('obPhone')}</label><input value={f.phone} onChange={e=>set('phone',e.target.value)}/></div>
    </div>:null}
    {step===1?<div className="ob-grid">
      <div className="field" style={{gridColumn:'1/3'}}><label>{t('address')}</label><input value={f.address} onChange={e=>set('address',e.target.value)}/></div>
      <div className="field"><label>{t('obCountry')}</label><select value={f.country} onChange={e=>set('country',e.target.value)}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
      <div className="field"><label>{t('currency')}</label><select value={f.currency} onChange={e=>set('currency',e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></div>
    </div>:null}
    {step===2?<div className="ob-grid">
      <div className="field"><label>{t('obLegal')}</label><input value={f.legalName} onChange={e=>set('legalName',e.target.value)} placeholder={f.company}/></div>
      <div className="field"><label>{t('obTaxId')}</label><input value={f.taxId} onChange={e=>set('taxId',e.target.value)} placeholder="Tax ID / RFC / VAT"/></div>
      <div className="field"><label>{t('obNeedInvoice')}</label><select value={f.needInvoice} onChange={e=>set('needInvoice',e.target.value)}><option value="yes">{t('yes')}</option><option value="no">{t('no')}</option></select></div>
      <div className="field" style={{gridColumn:'1/3'}}><label>{t('obExtra')}</label><input value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder={t('obExtraPh')}/></div>
    </div>:null}
    <div className="ob-actions">{step>0?<button className="btn ghost" onClick={()=>setStep(step-1)}>← {t('back')}</button>:<span/>}
      {step<2?<button className="btn" onClick={()=>setStep(step+1)}>{t('next')} →</button>:<button className="btn green" onClick={finish}><I.check style={{width:15,height:15}}/>{t('obFinish')}</button>}</div>
  </div></div>;
}

/* ===== IMPORT (manual + CSV with preview) ===== */
const SAMPLE_CSV="client,company,project,service,date,amount,currency,status,drive\nLunar Records,Lunar Records LLC,Midnight Bloom,Mixing & Mastering,2026-06-28,1200,USD,paid,https://drive.google.com/lunar\nNeon Lab,Neon Lab Inc,Neon Tokyo,Mastering,2026-06-18,1500,USD,paid,\nVelvet Co.,Velvet Co.,Velvet Skies,Production,2026-07-02,1300,USD,pending,\n,,No Client Row,,,900,USD,,";
function parseCSV(txt){const lines=(txt||'').trim().split(/\r?\n/);if(!lines[0])return{cols:[],rows:[]};const cols=lines[0].split(',').map(s=>s.trim());const rows=lines.slice(1).filter(l=>l.trim().replace(/,/g,'')).map(l=>{const cells=l.split(',');const o={};cols.forEach((c,i)=>o[c]=(cells[i]||'').trim());return o;});return{cols,rows};}
function ImportView({toast}){
  const{t}=useT();const[tab,setTab]=useState('csv');const[txt,setTxt]=useState(SAMPLE_CSV);const[preview,setPreview]=useState(null);
  const existing=CLIENTS.map(c=>c.name.toLowerCase());
  const run=()=>{const p=parseCSV(txt);const enriched=p.rows.map(r=>{const errs=['client','project'].filter(k=>!r[k]);const dup=existing.indexOf((r.client||'').toLowerCase())>=0;return {r,errs,dup};});setPreview({cols:p.cols,enriched});};
  const confirm=()=>{const ok=preview.enriched.filter(x=>x.errs.length===0).length;toast('✓ '+ok+' '+t('imported'));setPreview(null);};
  const onFile=(e)=>{const file=e.target.files&&e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>setTxt(String(rd.result));rd.readAsText(file);};
  return <div className="view content">
    <div className="h-row"><div><h1 style={{display:'flex',alignItems:'center',gap:10}}><I.down style={{width:24,height:24,color:'var(--accent)'}}/>{t('importTitle')}</h1><p>{t('importSub')}</p></div></div>
    <div className="seg" style={{marginBottom:16,maxWidth:320}}><button className={tab==='csv'?'on':''} style={{flex:1}} onClick={()=>setTab('csv')}>{t('bulkCsv')}</button><button className={tab==='manual'?'on':''} style={{flex:1}} onClick={()=>setTab('manual')}>{t('manual')}</button></div>
    {tab==='csv'?<div className="card solid" style={{padding:'18px 20px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:8}}><b style={{fontSize:14}}>{t('pasteCsv')}</b><label className="lc-upload"><input type="file" accept=".csv,text/csv" onChange={onFile} style={{display:'none'}}/><I.cloud style={{width:15,height:15}}/>{t('uploadFile')}</label></div>
      <textarea className="im-textarea" value={txt} onChange={e=>setTxt(e.target.value)} spellCheck="false"/>
      <div style={{marginTop:12}}><button className="btn" onClick={run}><I.grid style={{width:15,height:15}}/>{t('preview')}</button></div>
      {preview?<div className="im-preview">
        <div className="im-summary"><span><b>{preview.enriched.length}</b> {t('rowsDetected')}</span><span className="im-ok"><b>{preview.enriched.filter(x=>x.errs.length===0&&!x.dup).length}</b> {t('willImport')}</span><span className="im-dup"><b>{preview.enriched.filter(x=>x.dup).length}</b> {t('duplicates')}</span><span className="im-err"><b>{preview.enriched.filter(x=>x.errs.length).length}</b> {t('withErrors')}</span></div>
        <div className="im-tblwrap"><table className="tbl im-tbl"><thead><tr>{preview.cols.map(c=><th key={c}>{c}</th>)}<th></th></tr></thead>
          <tbody>{preview.enriched.map((x,i)=><tr key={i} className={x.errs.length?'im-rerr':(x.dup?'im-rdup':'')}>{preview.cols.map(c=><td key={c}>{x.r[c]}</td>)}<td>{x.errs.length?<span className="im-tag err">{t('missing')}: {x.errs.join(', ')}</span>:(x.dup?<span className="im-tag dup">{t('existing')}</span>:<span className="im-tag ok">{t('new')}</span>)}</td></tr>)}</tbody></table></div>
        <div style={{display:'flex',gap:10,marginTop:14}}><button className="btn ghost" onClick={()=>setPreview(null)}>{t('cancel')}</button><button className="btn green" onClick={confirm}><I.check style={{width:15,height:15}}/>{t('confirmImport')}</button></div>
      </div>:null}
    </div>:<div className="card solid" style={{padding:'18px 20px'}}>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div className="field"><label>{t('obCompany')}</label><input placeholder="Client company"/></div>
        <div className="field"><label>{t('email')}</label><input placeholder="billing@client.com"/></div>
        <div className="field"><label>{t('nav_projects')}</label><input placeholder="Project name"/></div>
        <div className="field"><label>{t('serviceType')}</label><input placeholder="Mixing & Mastering"/></div>
        <div className="field"><label>{t('amount')}</label><input placeholder="1200"/></div>
        <div className="field"><label>{t('status')}</label><select><option>Paid</option><option>Pending</option></select></div>
        <div className="field" style={{gridColumn:'1/3'}}><label>Google Drive</label><input placeholder="https://drive.google.com/…"/></div>
      </div>
      <button className="btn" style={{marginTop:8}} onClick={()=>toast('✓ 1 '+t('imported'))}><I.plus style={{width:15,height:15}}/>{t('addRecord')}</button>
    </div>}
  </div>;
}

/* ===== PAYMENT REMINDERS CONFIG (admin) ===== */
function RemindersCard({toast}){
  const{t}=useT();const[r,setR]=useState({before:true,beforeDays:3,onDue:true,after:true,afterDays:3,recurring:true,everyDays:7});
  const set=(k,v)=>setR(o=>Object.assign({},o,{[k]:v}));
  const row=(k,label,extra)=><div className="rm-row"><label className="rm-toggle"><input type="checkbox" checked={r[k]} onChange={e=>set(k,e.target.checked)}/><span>{label}</span></label>{extra}</div>;
  return <div className="card solid" style={{padding:'22px 24px',marginBottom:18}}>
    <b style={{fontSize:16,display:'flex',alignItems:'center',gap:9}}><I.bell style={{width:18,height:18,color:'var(--orange)'}}/>{t('remindersTitle')}</b>
    <p style={{fontSize:13,color:'var(--text-2)',margin:'4px 0 16px'}}>{t('remindersSub')}</p>
    {row('before',t('rmBefore'),<input className="rm-num" type="number" value={r.beforeDays} onChange={e=>set('beforeDays',+e.target.value)}/>)}
    {row('onDue',t('rmOnDue'),null)}
    {row('after',t('rmAfter'),<input className="rm-num" type="number" value={r.afterDays} onChange={e=>set('afterDays',+e.target.value)}/>)}
    {row('recurring',t('rmRecurring'),<input className="rm-num" type="number" value={r.everyDays} onChange={e=>set('everyDays',+e.target.value)}/>)}
    <button className="btn" style={{marginTop:14}} onClick={()=>{try{localStorage.setItem('im_reminders',JSON.stringify(r));}catch(_){}toast('✓ '+t('saveChanges'));}}>{t('saveChanges')}</button>
  </div>;
}

/* ===== Review Studio — live, Drive-backed audio review ===== */
async function rvToken(){ try{ const {data}=await supa.auth.getSession(); return (data&&data.session&&data.session.access_token)||null; }catch(_){ return null; } }
async function rv(action,body){
  const tok=await rvToken();
  const r=await fetch('/api/review',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},tok?{Authorization:'Bearer '+tok}:{}),body:JSON.stringify(Object.assign({action},body||{}))});
  let j; try{j=await r.json();}catch(_){j={};}
  if(!r.ok) throw Object.assign(new Error(j.error||('HTTP '+r.status)),{status:r.status,data:j});
  return j;
}
// client-side mirror of the protected-message filter (server remains authoritative)
function screenMsg(input){
  const s=String(input||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ​-‏‪-‮⁠﻿]/g,'');
  const deob=s.replace(/[\[\(\{<]\s*(at|arroba)\s*[\]\)\}>]/g,'@').replace(/\s+(at|arroba)\s+/g,'@').replace(/[\[\(\{<]\s*(dot|punto)\s*[\]\)\}>]/g,'.').replace(/\s+(dot|punto)\s+/g,'.').replace(/\s*@\s*/g,'@').replace(/\s*\.\s*/g,'.');
  if(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(deob)) return false;
  if(/\b(?:https?:\/\/|www\.)\S+/i.test(deob)) return false;
  if(/\b[a-z0-9-]+\.(?:com|net|org|io|me|co|app|link|gg|tv|xyz|info|biz|es|mx|to)\b/i.test(deob)) return false;
  if(/(^|[^a-z0-9._%+-])@[a-z0-9._]{2,}/i.test(deob)) return false;
  const plats=['instagram','insta','tiktok','whatsapp','telegram','snapchat','discord','linkedin','twitter','onlyfans','gmail','hotmail','outlook'];
  for(var i=0;i<plats.length;i++){ if(new RegExp('(^|[^a-z])'+plats[i]+'($|[^a-z])','i').test(s)) return false; }
  const intents=['contact me','dm me','message me','follow me','find me on','my number','my email','text me','call me','off platform','add me'];
  for(var k=0;k<intents.length;k++){ if(s.indexOf(intents[k])>=0) return false; }
  if(/(?:\+?\d[\s.\-()]*){7,}/.test(input)) return false;
  if(/\b\d{7,}\b/.test(input)) return false;
  return true;
}
const rsTime=(s)=>{ if(s==null||isNaN(s))return '0:00'; s=Math.max(0,Math.floor(s)); const m=Math.floor(s/60),ss=s%60; return m+':'+String(ss).padStart(2,'0'); };
const rsBytes=(b)=>{ if(!b)return ''; const u=['B','KB','MB','GB']; let i=0,n=b; while(n>=1024&&i<u.length-1){n/=1024;i++;} return n.toFixed(n<10&&i>0?1:0)+' '+u[i]; };
const rsDate=(iso)=>{ if(!iso)return ''; try{ const d=new Date(iso); return d.toLocaleDateString(undefined,{month:'short',day:'numeric'})+' · '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}); }catch(_){return '';} };
const PROC_LABEL={uploading:'Uploading to Google Drive',syncing:'Syncing file',processing:'Processing audio',retrying:'Reconnecting',ready:'Ready'};
const STATUS_COLOR={approved:'var(--green)',rejected:'var(--red)',changes_requested:'var(--orange)',submitted:'var(--accent)',in_review:'var(--accent)',pending:'var(--text-3)',draft:'var(--text-3)'};
const STATUS_LABEL={approved:'Approved',rejected:'Rejected',changes_requested:'Changes requested',submitted:'Pending review',in_review:'In review',pending:'Pending',draft:'Draft'};

function DriveAudioPlayer({versionId,versionNo,posRef,onEnded}){
  const audioRef=useRef(null);
  const [phase,setPhase]=useState('loading');   // loading|processing|ready|error
  const [code,setCode]=useState('');
  const [dur,setDur]=useState(0);
  const [cur,setCur]=useState(0);
  const [buf,setBuf]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [waiting,setWaiting]=useState(false);
  const [vol,setVol]=useState(()=>{ try{const v=parseFloat(localStorage.getItem('rs_vol')); return isNaN(v)?1:v;}catch(_){return 1;} });
  const pollRef=useRef(null), retryRef=useRef(null), retriesRef=useRef(0), aliveRef=useRef(true), dragRef=useRef(false);
  const bars=useMemo(()=>{ const id=String(versionId||'x'); const arr=[]; for(let i=0;i<52;i++){ const seed=(id.charCodeAt(i%id.length)||7)*(i+3); const v=Math.abs(Math.sin(seed)*0.5+Math.sin(seed*1.7)*0.5); arr.push(0.18+v*0.82); } return arr; },[versionId]);
  const clearTimers=()=>{ if(pollRef.current)clearTimeout(pollRef.current); if(retryRef.current)clearTimeout(retryRef.current); pollRef.current=null; retryRef.current=null; };

  const load=async()=>{
    clearTimers();
    try{
      const j=await rv('getPlayback',{version_id:versionId});
      if(!aliveRef.current)return;
      if(!j.ready){ setPhase('processing'); setCode(j.status||'processing'); if(j.duration_sec)setDur(j.duration_sec); pollRef.current=setTimeout(load,4000); return; }
      if(j.duration_sec)setDur(j.duration_sec);
      setPhase('ready'); setCode(''); retriesRef.current=0;
      const a=audioRef.current; if(a){ a.src=j.url; a.load(); a.volume=vol; const want=(posRef&&posRef.current&&posRef.current[versionId])||0; if(want){ try{a.currentTime=want; setCur(want);}catch(_){} } }
    }catch(e){
      if(!aliveRef.current)return;
      if(e.status===401){ setPhase('error'); setCode('signin'); return; }
      retriesRef.current++;
      if(retriesRef.current<=4){ setPhase('processing'); setCode('retrying'); retryRef.current=setTimeout(load,Math.min(6000,1500*retriesRef.current)); }
      else { setPhase('error'); setCode('load'); }
    }
  };
  useEffect(()=>{ aliveRef.current=true; setPlaying(false); setCur(0); setBuf(0); setPhase('loading'); load();
    return ()=>{ aliveRef.current=false; clearTimers(); const a=audioRef.current; if(a){ try{a.pause(); a.removeAttribute('src'); a.load();}catch(_){} } };
  },[versionId]);

  const onLoaded=()=>{ const a=audioRef.current; if(a&&a.duration&&isFinite(a.duration))setDur(a.duration); };
  const onTime=()=>{ const a=audioRef.current; if(!a)return; if(!dragRef.current)setCur(a.currentTime); if(posRef&&posRef.current)posRef.current[versionId]=a.currentTime; };
  const onProg=()=>{ const a=audioRef.current; if(!a||!a.buffered||!a.buffered.length||!a.duration)return; try{ setBuf(a.buffered.end(a.buffered.length-1)/a.duration); }catch(_){} };
  const onErr=()=>{ if(retriesRef.current<3){ retriesRef.current++; load(); } else { setPhase('error'); setCode('audio'); } };

  const toggle=()=>{ const a=audioRef.current; if(!a)return; if(a.paused){ a.play().then(()=>setPlaying(true)).catch(()=>{}); } else { a.pause(); setPlaying(false); } };
  const seekTo=(frac)=>{ const a=audioRef.current; const D=dur||(a&&a.duration)||0; if(!a||!D)return; const t=Math.max(0,Math.min(1,frac))*D; a.currentTime=t; setCur(t); };
  const skip=(d)=>{ const a=audioRef.current; if(!a)return; const D=dur||a.duration||0; a.currentTime=Math.max(0,Math.min(D,a.currentTime+d)); setCur(a.currentTime); };
  const changeVol=(v)=>{ setVol(v); const a=audioRef.current; if(a)a.volume=v; try{localStorage.setItem('rs_vol',String(v));}catch(_){} };
  const evFrac=(e,el)=>{ const r=el.getBoundingClientRect(); const cx=(e.touches&&e.touches[0]?e.touches[0].clientX:e.clientX); return (cx-r.left)/r.width; };
  const seekHandlers={
    onPointerDown:(e)=>{ dragRef.current=true; try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){} seekTo(evFrac(e,e.currentTarget)); },
    onPointerMove:(e)=>{ if(dragRef.current)seekTo(evFrac(e,e.currentTarget)); },
    onPointerUp:()=>{ dragRef.current=false; },
    onPointerCancel:()=>{ dragRef.current=false; },
  };

  const frac=dur?Math.min(1,cur/dur):0;
  const volIcon=vol===0?'M4 9v6h4l5 5V4L8 9H4z':(vol<0.5?'M4 9v6h4l5 5V4L8 9H4zM16 9a3 3 0 010 6':'M4 9v6h4l5 5V4L8 9H4zM16 9a3 3 0 010 6M18.5 7a6 6 0 010 10');

  if(phase!=='ready'){
    const isProc=phase==='processing'||phase==='loading';
    const emsg={missing:'File moved or deleted',permission:'Drive permissions disconnected',signin:'Sign in to listen',audio:"Couldn't load audio",load:"Couldn't reach the audio"};
    return <div className="rs-player"><audio ref={audioRef} preload="metadata" onLoadedMetadata={onLoaded} onTimeUpdate={onTime} onProgress={onProg} onWaiting={()=>setWaiting(true)} onPlaying={()=>{setWaiting(false);setPlaying(true);}} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);onEnded&&onEnded();}} onError={onErr} style={{display:'none'}}/>
      <div className="rs-state">
        {isProc?<><div className="rs-spin"/><h5>{phase==='loading'?'Preparing playback':(PROC_LABEL[code]||'Processing audio')}</h5><div className="rs-proc-bar"><i/></div><p>Google Drive is getting this version ready. This updates automatically — no need to refresh.</p></>
        :<><div style={{width:38,height:38,borderRadius:'50%',background:'rgba(255,59,48,.14)',display:'flex',alignItems:'center',justifyContent:'center'}}><I.x style={{width:20,height:20,color:'var(--red)'}}/></div><h5>{emsg[code]||'Unavailable'}</h5><p>{code==='permission'?'The connection to Google Drive needs to be re-authorized.':code==='missing'?'This file is no longer in the project folder.':'A temporary problem occurred while loading the audio.'}</p><button className="btn ghost sm" onClick={()=>{retriesRef.current=0;setPhase('loading');load();}}>Retry connection</button></>}
      </div>
    </div>;
  }
  return <div className="rs-player">
    <audio ref={audioRef} preload="metadata" onLoadedMetadata={onLoaded} onTimeUpdate={onTime} onProgress={onProg} onWaiting={()=>setWaiting(true)} onPlaying={()=>{setWaiting(false);setPlaying(true);}} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);onEnded&&onEnded();}} onError={onErr} style={{display:'none'}}/>
    <div className="rs-wave" {...seekHandlers}>{bars.map((h,i)=><div key={i} className={"b"+(i/bars.length<=frac?" on":"")} style={{height:(h*100)+'%'}}/>)}</div>
    <div className="rs-seek" {...seekHandlers}><div className="buf" style={{width:(buf*100)+'%'}}/><div className="fill" style={{width:(frac*100)+'%'}}/><div className="knob" style={{left:(frac*100)+'%'}}/></div>
    <div className="rs-times"><span>{rsTime(cur)}</span><span>{waiting?'buffering…':rsTime(dur)}</span></div>
    <div className="rs-controls">
      <button className="rs-play" onClick={toggle} aria-label={playing?'Pause':'Play'}>{playing?<I.pause style={{width:22,height:22}}/>:<I.play style={{width:22,height:22,marginLeft:2}}/>}</button>
      <button className="rs-icbtn" onClick={()=>skip(-10)} aria-label="Back 10s"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 8L7 12l4 4M17 8l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/></svg><small>10</small></button>
      <button className="rs-icbtn" onClick={()=>skip(10)} aria-label="Forward 10s"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 8l4 4-4 4M7 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg><small>10</small></button>
      <div className="rs-vol"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" style={{color:'var(--text-3)'}}><path d={volIcon} strokeLinecap="round" strokeLinejoin="round"/></svg><input type="range" min="0" max="1" step="0.02" value={vol} onChange={(e)=>changeVol(parseFloat(e.target.value))} aria-label="Volume"/></div>
    </div>
  </div>;
}

function DownloadPopup({submissionId,title,close,toast}){
  const [opts,setOpts]=useState(null);
  const [sel,setSel]=useState({masters:true,stems:false,contracts:false});
  const [busy,setBusy]=useState(false);
  const [noAccess,setNoAccess]=useState(false);
  useEffect(()=>{ (async()=>{ if(!submissionId){ setNoAccess(true); setOpts({}); return; } try{ const j=await rv('downloadOptions',{submission_id:submissionId}); if(!j.options){ setNoAccess(true); setOpts({}); return; } setOpts(j.options); setSel({masters:!!j.options.masters,stems:false,contracts:false}); }catch(e){ setNoAccess(true); setOpts({}); } })(); },[]);
  if(noAccess) return <div className="rs-dlg-back" onClick={close}><div className="rs-dlg" onClick={e=>e.stopPropagation()} style={{maxWidth:380,textAlign:'center'}}>
    <div style={{width:52,height:52,borderRadius:15,margin:'2px auto 12px',background:'var(--sep)',display:'flex',alignItems:'center',justifyContent:'center'}}><I.folder style={{width:24,height:24,color:'var(--text-3)'}}/></div>
    <h3 style={{fontSize:17}}>No files to download yet</h3>
    <div className="sub" style={{marginBottom:14}}>{title} isn’t connected to Google Drive, or has no files uploaded yet.</div>
    <button className="btn ghost" style={{width:'100%',justifyContent:'center'}} onClick={close}>Close</button>
  </div></div>;
  const rows=[['masters','Masters','Final mixed masters','note'],['stems','Stems','Individual track stems','grid'],['contracts','Contracts','Agreements & invoices','contract']];
  const toggle=(k)=>{ if(opts&&!opts[k])return; setSel(s=>Object.assign({},s,{[k]:!s[k]})); };
  const chosen=rows.map(r=>r[0]).filter(k=>sel[k]);
  const download=async()=>{
    if(!chosen.length)return; setBusy(true);
    try{ const j=await rv('getDownload',{submission_id:submissionId,kinds:chosen});
      if(j.url){ const a=document.createElement('a'); a.href=j.url; a.rel='noopener'; document.body.appendChild(a); a.click(); a.remove(); toast('⬇ Preparing your download…'); close(); }
      else toast('✗ '+(j.error||'Could not prepare download'));
    }catch(e){ toast('✗ '+(e.message||'Error')); }
    setBusy(false);
  };
  return <div className="rs-dlg-back" onClick={close}><div className="rs-dlg" onClick={e=>e.stopPropagation()}>
    <h3>Download files</h3>
    <div className="sub">{title} · choose what to include</div>
    {opts===null?<div style={{padding:'2px 0'}}>{[0,1,2].map(i=><div key={i} className="rs-sk" style={{height:64,marginBottom:9,borderRadius:15}}/>)}</div>
    :rows.map(function(r){ const k=r[0],avail=opts[k],on=sel[k]&&avail;
      return <button key={k} className={"rs-dlg-opt"+(on?' on':'')+(avail?'':' disabled')} onClick={()=>toggle(k)}>
        <span className="ic">{I[r[3]]({style:{width:19,height:19}})}</span>
        <span className="tx"><b>{r[1]}</b><small>{avail?r[2]:'Not available for this project'}</small></span>
        <span className="ck">{on?<I.check style={{width:13,height:13}}/>:null}</span>
      </button>; })}
    <div className="rs-dlg-acts"><button className="btn ghost" style={{flex:1,justifyContent:'center'}} onClick={close}>Cancel</button>
      <button className="btn" style={{flex:1.4,justifyContent:'center',opacity:chosen.length&&!busy?1:.5}} disabled={!chosen.length||busy} onClick={download}><I.down style={{width:15,height:15}}/>{busy?'Preparing…':'Download'+(chosen.length>1?' ('+chosen.length+')':'')}</button></div>
  </div></div>;
}

function ReviewStudio({role,toast,initialSub}){
  const isClient=role==='client', isArtist=role==='artist', isStaff=role==='admin'||role==='superadmin';
  const canDecide=isClient||isStaff, canUpload=isArtist||isStaff;
  const [items,setItems]=useState(null);
  const [err,setErr]=useState('');
  const [sub,setSub]=useState(null);
  const [thread,setThread]=useState(null);
  const [selVer,setSelVer]=useState(null);
  const [busy,setBusy]=useState(false);
  const [tab,setTab]=useState('player');
  const [general,setGeneral]=useState('');
  const [msg,setMsg]=useState('');
  const [flash,setFlash]=useState('');
  const [revSummary,setRevSummary]=useState('');
  const [uploadPct,setUploadPct]=useState(-1);
  const [vfilter,setVfilter]=useState('all');
  const [dlPopup,setDlPopup]=useState(false);
  const posRef=useRef({});
  const fileRef=useRef(null);
  const RsSwitch=({on,disabled,onClick})=><button disabled={disabled} onClick={onClick} style={{width:42,height:25,borderRadius:13,background:on?'var(--green)':'var(--sep-strong)',position:'relative',transition:'background .2s',flex:'0 0 42px',cursor:disabled?'default':'pointer',opacity:disabled?.55:1}}><span style={{position:'absolute',top:2,left:on?19:2,width:21,height:21,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}/></button>;
  const toggleMsg=async(key,val)=>{ try{ await rv('setMessaging',{project_id:sub.project_id,[key]:val}); await loadThread(sub.submission_id); toast('✓ Messaging updated'); }catch(e){ toast('✗ '+(e.message||'Error')); } };

  const loadList=async()=>{ setErr(''); try{ const j=await rv('listMine'); setItems(j.items||[]); }catch(e){ setErr(e.status===401?'signin':(e.message||'error')); setItems([]); } };
  const loadThread=async(sid)=>{ try{ const j=await rv('listThread',{submission_id:sid}); setThread(j); const cur=j.submission&&j.submission.current_version; setSelVer(cur||(j.versions.length?j.versions[j.versions.length-1].id:null)); }catch(e){ toast('✗ '+(e.message||'Error')); } };
  useEffect(()=>{ loadList(); },[]);
  useEffect(()=>{ if(initialSub&&initialSub.submission_id) setSub(initialSub); },[initialSub]);
  useEffect(()=>{ if(sub){ setThread(null); loadThread(sub.submission_id); } },[sub]);

  const versions=thread?thread.versions:[];
  const selIdx=versions.findIndex(v=>v.id===selVer);
  const ver=selIdx>=0?versions[selIdx]:null;
  const prevVer=selIdx>0?versions[selIdx-1]:null;
  const subInfo=thread?thread.submission:null;
  const messaging=thread&&thread.messaging?thread.messaging:{};
  const canMessage=!!messaging.can_message;
  const isApproved=(v)=>v.decision==='approved'||(subInfo&&v.id===subInfo.approved_version);
  const railVersions=vfilter==='approved'?versions.filter(isApproved):versions;
  const dlDemo=async()=>{ if(!ver||!ver.has_audio)return; try{ const j=await rv('getPlayback',{version_id:ver.id}); if(j.url){ const a=document.createElement('a'); a.href=j.url+'&dl=1'; a.rel='noopener'; document.body.appendChild(a); a.click(); a.remove(); toast('⬇ Downloading V'+ver.version_no); } else toast('Audio still processing'); }catch(e){ toast('✗ '+(e.message||'Error')); } };
  const verFeedback=thread?thread.feedback.filter(f=>f.version_id===selVer):[];
  const verItems=thread?thread.items.filter(x=>x.version_id===selVer):[];
  const verComments=thread?thread.comments.filter(c=>c.version_id===selVer):[];

  const compareTo=(other)=>{ if(!other)return; posRef.current[other]=posRef.current[selVer]||0; setSelVer(other); toast('A/B · switched to V'+versions.find(v=>v.id===other).version_no); };

  const doDecide=async(decision)=>{
    if((decision==='reject'||decision==='request_changes')&&general.trim()&&!screenMsg(general)){ toast('⚠︎ Blocked: remove contact info / links'); return; }
    setBusy(true);
    try{ const body={submission_id:sub.submission_id,decision}; if(general.trim())body.general_text=general.trim();
      const j=await rv('decide',body);
      if(j.blocked){ toast('⚠︎ '+(j.message||'Message blocked')); }
      else { setFlash(decision==='approve'?'rgba(52,199,89,.5)':decision==='reject'?'rgba(255,59,48,.45)':'rgba(255,159,10,.45)'); setTimeout(()=>setFlash(''),900); setGeneral(''); toast('✓ '+(decision==='approve'?'Version approved':decision==='request_changes'?'Changes requested':'Version rejected')); await loadThread(sub.submission_id); }
    }catch(e){ toast('✗ '+(e.message||'Error')); }
    setBusy(false);
  };
  const doSend=async()=>{ const b=msg.trim(); if(!b)return; if(!screenMsg(b)){ toast('⚠︎ Blocked: no contact info, links or handles'); return; } setBusy(true);
    try{ const j=await rv('sendMessage',{project_id:sub.project_id,submission_id:sub.submission_id,body:b}); if(j.blocked)toast('⚠︎ '+(j.message||'Message blocked')); else { setMsg(''); await loadThread(sub.submission_id); } }catch(e){ toast('✗ '+(e.message||'Error')); } setBusy(false);
  };
  const readDuration=(file)=>new Promise((res)=>{ try{ const a=document.createElement('audio'); a.preload='metadata'; a.onloadedmetadata=()=>{ const d=a.duration; try{URL.revokeObjectURL(a.src);}catch(_){}; res(isFinite(d)?Math.round(d):null); }; a.onerror=()=>res(null); a.src=URL.createObjectURL(file); }catch(_){ res(null); } });
  const putResumable=(url,file,onProg)=>new Promise((res,rej)=>{ const xhr=new XMLHttpRequest(); xhr.open('PUT',url); xhr.upload.onprogress=(e)=>{ if(e.lengthComputable&&onProg)onProg(Math.round(e.loaded/e.total*100)); }; xhr.onload=()=>{ if(xhr.status>=200&&xhr.status<300){ try{res(JSON.parse(xhr.responseText));}catch(_){res({});} } else rej(new Error('Upload '+xhr.status)); }; xhr.onerror=()=>rej(new Error('network')); xhr.setRequestHeader('Content-Type',file.type||'application/octet-stream'); xhr.send(file); });
  const doUpload=async(file)=>{
    if(!file)return;
    if(!/audio\//.test(file.type||'')&&!/\.(mp3|wav|m4a|aac|flac|ogg|aiff?)$/i.test(file.name)){ toast('⚠︎ Please choose an audio file'); return; }
    if(revSummary.trim()&&!screenMsg(revSummary)){ toast('⚠︎ Summary blocked: no contact info'); return; }
    setUploadPct(0);
    try{
      const duration=await readDuration(file);
      const start=await rv('startUpload',{submission_id:sub.submission_id,filename:file.name,mime:file.type||'audio/mpeg'});
      const df=await putResumable(start.uploadUrl,file,(p)=>setUploadPct(p));
      await rv('uploadVersion',{submission_id:sub.submission_id,drive_file_id:df.id,mime_type:df.mimeType||file.type||'audio/mpeg',size_bytes:Number(df.size||file.size)||null,original_filename:file.name,duration_sec:duration,revision_summary:revSummary.trim()||null});
      setUploadPct(-1); setRevSummary(''); toast('✓ New version uploaded'); await loadThread(sub.submission_id);
    }catch(e){ setUploadPct(-1); toast('✗ '+(e.message||'Upload failed')); }
  };

  // ── sign-in required (demo mode without a real session) ──
  if(err==='signin') return <div className="view content"><div className="rs" style={{textAlign:'center',padding:'60px 20px'}}><div style={{maxWidth:360,margin:'0 auto'}}><div style={{width:56,height:56,borderRadius:16,margin:'0 auto 16px',background:'linear-gradient(135deg,#5e5ce6,#0a84ff)',display:'flex',alignItems:'center',justifyContent:'center'}}><I.chat style={{width:26,height:26,color:'#fff'}}/></div><h2 style={{fontSize:20,fontWeight:640}}>Sign in to review</h2><p style={{color:'var(--text-2)',fontSize:14,marginTop:8,lineHeight:1.5}}>The live feedback studio needs your Ideal Music account. Sign out of the demo and sign in with your email to load your projects.</p></div></div></div>;

  // ── list view ──
  if(!sub){
    return <div className="view content"><div className="rs"><div className="rs-wrap">
      <div style={{marginBottom:18}}><h1 style={{fontSize:22,fontWeight:680,letterSpacing:'-.02em'}}>Feedback</h1><p style={{color:'var(--text-2)',fontSize:14,marginTop:3}}>{isClient?'Listen to demos and leave feedback for each version.':isArtist?'Upload revisions and track client decisions.':'Every review across your projects.'}</p></div>
      {items===null?<div className="rs-list">{[0,1,2].map(i=><div key={i} className="rs-sk" style={{height:104}}/>)}</div>
      :items.length===0?<div className="rs-card" style={{textAlign:'center',padding:'44px 20px'}}><div style={{width:52,height:52,borderRadius:15,margin:'0 auto 14px',background:'var(--sep)',display:'flex',alignItems:'center',justifyContent:'center'}}><I.folder style={{width:24,height:24,color:'var(--text-3)'}}/></div><h5 style={{fontSize:15,fontWeight:600}}>Nothing to review yet</h5><p style={{color:'var(--text-3)',fontSize:13,marginTop:6,maxWidth:340,margin:'6px auto 0',lineHeight:1.5}}>{canUpload?'When you upload a demo to a project, it will appear here for client review.':'When an artist uploads a demo to one of your projects, it will show up here.'}</p></div>
      :<div className="rs-list">{items.map(it=><button key={it.submission_id} className="rs-subcard" onClick={()=>setSub(it)}>
          <div className="rs-sc-top"><div className="rs-sc-ic"><I.note style={{width:20,height:20}}/></div><div style={{minWidth:0,flex:1}}><h4>{it.project_title}</h4><div className="rs-sc-meta"><span className="rs-dot" style={{background:STATUS_COLOR[it.status]||'var(--text-3)'}}/>{STATUS_LABEL[it.status]||it.status}</div></div></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span className="rs-vcount"><I.note style={{width:13,height:13}}/>{it.versions_count} version{it.versions_count===1?'':'s'}</span>{it.approved_version_no?<span className="rs-badge approved">V{it.approved_version_no} approved</span>:<span className="rs-badge current">V{it.current_version_no||it.versions_count} current</span>}<I.arrow style={{width:16,height:16,color:'var(--text-3)',marginLeft:'auto'}}/></div>
        </button>)}</div>}
    </div></div></div>;
  }

  // ── thread view (version rail + player + feedback) ──
  const statusPill=(s)=><span className="rs-badge" style={{background:(STATUS_COLOR[s]||'var(--text-3)')+'22',color:STATUS_COLOR[s]||'var(--text-3)'}}>{STATUS_LABEL[s]||s}</span>;
  const railPane=<div className="rs-pane rail" style={{display:tab==='versions'?'block':undefined}}><div className="rs-rail"><div className="rs-rail-h" style={{display:'flex',alignItems:'center',gap:6}}>Versions<div style={{marginLeft:'auto',display:'flex',gap:2,background:'var(--sep)',borderRadius:8,padding:2}}><button onClick={()=>setVfilter('all')} style={{fontSize:10.5,fontWeight:640,padding:'3px 9px',borderRadius:6,background:vfilter==='all'?'var(--card-solid)':'transparent',color:vfilter==='all'?'var(--text)':'var(--text-3)'}}>All</button><button onClick={()=>setVfilter('approved')} style={{fontSize:10.5,fontWeight:640,padding:'3px 9px',borderRadius:6,background:vfilter==='approved'?'var(--card-solid)':'transparent',color:vfilter==='approved'?'var(--green)':'var(--text-3)'}}>Approved</button></div></div>
    {railVersions.length===0&&<div style={{padding:'18px 8px',fontSize:12,color:'var(--text-3)',textAlign:'center',lineHeight:1.5}}>No approved versions yet.<br/>Approve a demo to collect it here.</div>}
    {railVersions.map(v=>{ const isCur=subInfo&&v.id===subInfo.current_version; const isAppr=subInfo&&v.id===subInfo.approved_version; const pc={ready:'var(--green)',processing:'var(--orange)',uploading:'var(--orange)',syncing:'var(--orange)',missing:'var(--red)',permission:'var(--red)',error:'var(--red)'}[v.processing_status]||'var(--text-3)';
      return <button key={v.id} className={"rs-vitem"+(v.id===selVer?" sel":"")} onClick={()=>{setSelVer(v.id);setTab('player');}}>
        <div className="rs-vtop"><span className="rs-vno">V{v.version_no}</span>{isCur&&<span className="rs-badge current">Current</span>}{isAppr&&<span className="rs-badge approved">Approved</span>}<span style={{marginLeft:'auto'}}>{statusPill(v.decision||(isCur?subInfo.status:'submitted'))}</span></div>
        {v.original_filename&&<div className="rs-vname">{v.original_filename}</div>}
        <div className="rs-vsub"><span className="rs-dot" style={{background:pc}}/>{v.processing_status==='ready'?(v.duration_sec?rsTime(v.duration_sec):'Audio'):(PROC_LABEL[v.processing_status]||v.processing_status)}<span>·</span>{rsDate(v.created_at)}{v.by&&<><span>·</span><span style={{textTransform:'capitalize'}}>{v.by}</span></>}</div>
        {v.last_feedback_at&&<div className="rs-vsub" style={{color:'var(--accent-2)'}}>Feedback {rsDate(v.last_feedback_at)}</div>}
      </button>; })}
  </div></div>;

  const playerPane=<div className="rs-pane" style={{display:(tab==='player')?undefined:'none'}}><div className="rs-main">
    <div style={{position:'relative'}}>
      <div className="rs-player" style={{marginBottom:0}}>
        <div className="rs-pl-head"><div style={{minWidth:0,flex:1}}><div style={{fontSize:11,fontWeight:640,color:'var(--accent-2)',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:3,display:'flex',alignItems:'center',gap:5}}><I.note style={{width:12,height:12}}/>{sub.project_title}</div><div className="rs-pl-title">Version {ver?ver.version_no:'—'}{ver&&subInfo&&ver.id===subInfo.approved_version?' · Approved':''}</div>{ver&&ver.original_filename&&<div className="rs-pl-file">{ver.original_filename}{ver.size_bytes?' · '+rsBytes(ver.size_bytes):''}</div>}</div>{ver&&<div style={{display:'flex',alignItems:'center',gap:8}}>{ver.has_audio&&<button className="rs-icbtn" style={{width:36,height:36,flex:'0 0 36px'}} onClick={dlDemo} title="Download this version"><I.down style={{width:16,height:16}}/></button>}{statusPill(ver.decision||(subInfo&&ver.id===subInfo.current_version?subInfo.status:'submitted'))}</div>}</div>
      </div>
      {ver&&(ver.has_audio?<div style={{marginTop:-2}}><DriveAudioPlayer versionId={ver.id} versionNo={ver.version_no} posRef={posRef} onEnded={()=>{}}/></div>
        :<div className="rs-player"><div className="rs-state"><div className="rs-spin"/><h5>{PROC_LABEL[ver.processing_status]||'Processing audio'}</h5><div className="rs-proc-bar"><i/></div><p>This version is being prepared. It will start playing automatically once Drive finishes.</p></div></div>)}
      {flash&&<div className="rs-flash go" style={{background:flash}}/>}
    </div>
    {ver&&<div className="rs-player" style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',padding:'14px 18px'}}>
      <div style={{fontSize:12.5,color:'var(--text-3)'}}>{ver.revision_summary?ver.revision_summary:'No revision note'}</div>
      {prevVer&&<button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={()=>compareTo(prevVer.id)}><I.back style={{width:14,height:14}}/>A/B vs V{prevVer.version_no}</button>}
    </div>}
  </div></div>;

  const sidePane=<div className="rs-pane" style={{display:(tab==='feedback')?undefined:'none'}}><div className="rs-side">
    {canDecide&&ver&&<div className="rs-card"><h5>Your decision<span className="rs-vtag">V{ver.version_no}</span></h5>
      <textarea className="rs-ta" placeholder="Add feedback for this version… (what to change, what works)" value={general} onChange={(e)=>setGeneral(e.target.value)}/>
      {general.trim()&&!screenMsg(general)&&<div className="rs-warn"><I.x style={{width:13,height:13,flex:'0 0 13px',marginTop:1}}/>Remove contact info, links or social handles to send.</div>}
      <div className="rs-decide"><button className="btn green" disabled={busy} onClick={()=>doDecide('approve')}><I.check style={{width:15,height:15}}/>Approve</button><button className="btn" style={{background:'var(--orange)',boxShadow:'0 4px 14px rgba(255,159,10,.3)'}} disabled={busy} onClick={()=>doDecide('request_changes')}>Request changes</button><button className="btn red" disabled={busy} onClick={()=>doDecide('reject')}><I.x style={{width:15,height:15}}/>Reject</button></div>
    </div>}
    {canUpload&&<div className="rs-card"><h5>Upload a new version</h5>
      <input type="text" className="rs-msg" style={{width:'100%',border:'1px solid var(--sep-strong)',borderRadius:11,padding:'10px 13px',fontSize:13,background:'var(--bg-solid)',color:'var(--text)',marginBottom:10}} placeholder="Revision note (optional) — what changed" value={revSummary} onChange={(e)=>setRevSummary(e.target.value)}/>
      <input ref={fileRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.aiff" style={{display:'none'}} onChange={(e)=>{ const f=e.target.files&&e.target.files[0]; if(f)doUpload(f); e.target.value=''; }}/>
      {uploadPct<0?<div className="rs-upload-zone" onClick={()=>fileRef.current&&fileRef.current.click()}><I.up style={{width:22,height:22,color:'var(--accent)'}}/><div style={{fontSize:13,fontWeight:560,marginTop:6}}>Choose an audio file</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>Saved privately to the project's Drive folder</div></div>
      :<div><div style={{fontSize:12.5,color:'var(--text-2)',marginBottom:6}}>{uploadPct<100?'Uploading to Google Drive… '+uploadPct+'%':'Finalizing…'}</div><div className="rs-proc-bar" style={{width:'100%',maxWidth:'none'}}><i style={{animation:'none',left:0,width:uploadPct+'%',background:'var(--accent)'}}/></div></div>}
    </div>}
    <div className="rs-card"><h5>Feedback{ver?<span className="rs-vtag">V{ver.version_no}</span>:null}</h5>
      {verFeedback.length===0&&verItems.length===0&&verComments.length===0?<p style={{fontSize:12.5,color:'var(--text-3)'}}>No feedback on this version yet.</p>:null}
      {verFeedback.map(f=><div key={f.id} className="rs-fb"><div className="rs-fb-role">Client feedback</div><p>{f.general_text}</p><div className="rs-fb-time">{rsDate(f.created_at)}</div></div>)}
      {verItems.length>0&&<div style={{marginBottom:8}}>{verItems.map(it=><div key={it.id} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'5px 0',fontSize:12.5}}><span className="rs-dot" style={{marginTop:5,background:it.level==='required'?'var(--red)':it.level==='optional'?'var(--text-3)':'var(--orange)'}}/><div><b style={{textTransform:'capitalize'}}>{it.category||'Note'}: </b>{it.body}</div></div>)}</div>}
      {verComments.map(c=><div key={c.id} className="rs-cmt"><span className="ts">{rsTime(c.ts_sec)}</span><p>{c.body}</p></div>)}
    </div>
    {isStaff&&<div className="rs-card"><h5>Messaging<span className="rs-vtag" style={{background:'var(--sep)',color:'var(--text-3)'}}>admin</span></h5>
      <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'6px 0'}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:560}}>Client messaging</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:1,lineHeight:1.4}}>Off by default — clients only see the decision buttons.</div></div><RsSwitch on={!!messaging.enabled} onClick={()=>toggleMsg('messaging_enabled',!messaging.enabled)}/></div>
      <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'6px 0',opacity:messaging.enabled?1:.5}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:560}}>Allow artist to message</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:1,lineHeight:1.4}}>Lets the assigned artist reply too.</div></div><RsSwitch on={!!messaging.artist_enabled} disabled={!messaging.enabled} onClick={()=>toggleMsg('artist_messaging_enabled',!messaging.artist_enabled)}/></div>
    </div>}
    {(canMessage||(thread&&thread.messages.length>0))&&<div className="rs-card"><h5>Messages</h5>
      {thread&&thread.messages.length===0?<p style={{fontSize:12.5,color:'var(--text-3)'}}>No messages yet.</p>:null}
      {thread&&thread.messages.map(m=><div key={m.id} style={{padding:'7px 0',borderBottom:'1px solid var(--sep)'}}><div style={{fontSize:11,fontWeight:640,color:'var(--text-2)',textTransform:'capitalize'}}>{m.sender_role}</div><p style={{fontSize:12.5,lineHeight:1.5,marginTop:2}}>{m.body}</p></div>)}
      {canMessage&&<><div className="rs-msg"><input placeholder="Message (no contact info)" value={msg} onChange={(e)=>setMsg(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter')doSend();}}/><button className="btn sm" disabled={busy||!msg.trim()} onClick={doSend}>Send</button></div>
      {msg.trim()&&!screenMsg(msg)&&<div className="rs-warn"><I.x style={{width:13,height:13,flex:'0 0 13px',marginTop:1}}/>Blocked: personal contact details can't be shared.</div>}</>}
    </div>}
  </div></div>;

  return <div className="view content"><div className="rs"><div className="rs-wrap">
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,flexWrap:'wrap'}}>
      <button className="btn ghost sm" onClick={()=>{setSub(null);setThread(null);}}><I.back style={{width:15,height:15}}/>All</button>
      <div style={{minWidth:0}}><h1 style={{fontSize:19,fontWeight:680,letterSpacing:'-.02em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sub.project_title}</h1><div style={{fontSize:12.5,color:'var(--text-3)',display:'flex',alignItems:'center',gap:7,marginTop:1}}>{subInfo&&<><span className="rs-dot" style={{background:STATUS_COLOR[subInfo.status]||'var(--text-3)'}}/>{STATUS_LABEL[subInfo.status]||subInfo.status}<span>·</span>{versions.length} version{versions.length===1?'':'s'}</>}</div></div>
      <button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={()=>setDlPopup(true)} title="Download project files"><I.down style={{width:15,height:15}}/>Download</button>
    </div>
    <div className="rs-tabbar"><button className={tab==='versions'?'on':''} onClick={()=>setTab('versions')}>Versions</button><button className={tab==='player'?'on':''} onClick={()=>setTab('player')}>Player</button><button className={tab==='feedback'?'on':''} onClick={()=>setTab('feedback')}>Feedback</button></div>
    {!thread?<div className="rs-studio"><div className="rs-sk" style={{height:320}}/><div className="rs-sk" style={{height:320}}/></div>
    :<div className="rs-studio">{railPane}{playerPane}{sidePane}</div>}
    {dlPopup&&<DownloadPopup submissionId={sub.submission_id} title={sub.project_title} close={()=>setDlPopup(false)} toast={toast}/>}
  </div></div></div>;
}

function Shell({role,setRole,isSuper,lang,setLang,theme,setTheme}){
  const{t}=useT();
  const[page,setPage]=useState('dashboard');const[activeProject,setActiveProject]=useState(null);const[reviewSub,setReviewSub]=useState(null);
  const[cmdk,setCmdk]=useState(false);const[notif,setNotif]=useState(false);const[newP,setNewP]=useState(false);const[toastMsg,setToastMsg]=useState(null);const[mnav,setMnav]=useState(false);
  const toast=(m)=>{setToastMsg(m);setTimeout(()=>setToastMsg(null),2600);};
  useEffect(()=>{const h=(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setCmdk(v=>!v);}if(e.key==='Escape'){setCmdk(false);setNotif(false);setNewP(false);}};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[]);
  const go=(p,proj)=>{setMnav(false);if(p==='new'){setNewP(true);return;}if(p==='project'){setActiveProject(proj);setPage('project');return;}if(p==='review'){setReviewSub(proj?Object.assign({},proj,{_k:Date.now()}):null);setPage('review');setActiveProject(null);setNotif(false);return;}setPage(p);setActiveProject(null);setNotif(false);};
  const nav=role==='admin'
    ?[['dashboard','grid',t('nav_dashboard')],['projects','folder',t('nav_projects')],['review','chat','Feedback'],['requests','inbox',t('nav_requests')],['contracts','contract',t('nav_contracts')],['invoices','receipt',t('nav_invoices')],['payments','dollar',t('nav_payments')],['accounting','activity',t('accounting')],['calendar','cal',t('nav_calendar')],['drive','drive',t('nav_drive')],['users','users',t('nav_users')],['import','down',t('importTitle')],['settings','settings',t('nav_settings')]]
    :role==='client'
    ?[['dashboard','grid',t('nav_home')],['projects','folder',t('nav_myprojects')],['review','chat','Feedback'],['requests','inbox',t('nav_requests')],['contracts','contract',t('nav_contracts')],['invoices','receipt',t('nav_invoices')],['drive','drive',t('nav_myfiles')],['settings','settings',t('nav_settings')]]
    :[['dashboard','grid',t('nav_home')],['projects','folder',t('nav_assigned')],['review','chat','Feedback'],['earnings','dollar',t('nav_earnings')],['drive','drive',t('nav_files')],['settings','settings',t('nav_settings')]];
  const titles={dashboard:role==='admin'?t('nav_dashboard'):t('nav_home'),projects:role==='client'?t('nav_myprojects'):role==='artist'?t('nav_assigned'):t('nav_projects'),review:'Feedback',requests:t('requestsTitle'),contracts:t('contractsTitle'),invoices:t('invoicesTitle'),payments:t('paymentsTitle'),accounting:t('accounting'),import:t('importTitle'),earnings:t('nav_earnings'),calendar:t('calTitle'),drive:t('driveTitle'),users:t('usersTitle'),settings:t('settingsTitle'),project:activeProject?activeProject.title:''};
  const prof=PROFILES[role];const subt={admin:t('workspace'),client:t('portal'),artist:t('studio')}[role];
  return <div className="shell">
    <aside className={"sidebar"+(mnav?" open":"")}>
      <div className="sb-brand"><div className="bm"><img src="/logo-white.png" alt="" style={{width:'70%',height:'70%',objectFit:'contain'}}/></div><div><b>Ideal Music</b><small>{subt}</small></div></div>
      <div className="navlabel">{t('menu')}</div>
      {nav.map(([k,ic,l])=><button key={k} className={"navitem"+(page===k?' active':'')} onClick={()=>go(k)}><span className="ico">{I[ic]({style:{width:18,height:18}})}</span>{l}{k==='requests'&&role==='admin'&&<span className="badge">2</span>}{k==='projects'&&role==='client'&&<span className="badge">1</span>}</button>)}
      <div className="navlabel">{t('quick')}</div>
      <button className="navitem" onClick={()=>setCmdk(true)}><span className="ico"><I.search style={{width:18,height:18}}/></span>{t('search').replace('…','')}<kbd style={{marginLeft:'auto',fontSize:10,background:'var(--sep)',borderRadius:4,padding:'1px 5px',color:'var(--text-3)'}}>⌘K</kbd></button>
      <button className="navitem" onClick={()=>setTheme(theme==='dark'?'light':'dark')}><span className="ico">{theme==='dark'?<I.sun style={{width:18,height:18}}/>:<I.moon style={{width:18,height:18}}/>}</span>{theme==='dark'?t('lightMode'):t('darkMode')}</button>
      <div className="sb-spacer"/>
      <div className="userchip" onClick={()=>toast(t('switchRole'))}><Avatar name={prof.name} i={prof.i}/><div className="meta"><b>{prof.name}</b><small>{t('role_'+role)}</small></div><I.lock style={{width:14,height:14,color:'var(--text-3)',marginLeft:'auto'}}/></div>
      <button className="navitem" style={{justifyContent:'center',color:'var(--red)'}} onClick={()=>setRole(null)}>{t('signout')}</button>
    </aside>
    {mnav?<div className="sb-backdrop" onClick={()=>setMnav(false)}/>:null}
    <main className="main">
      <header className="topbar"><button className="hamb" onClick={()=>setMnav(true)} aria-label="Menu"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/></svg></button><h2>{titles[page]}</h2>
        <div className="search" onClick={()=>setCmdk(true)}><I.search style={{width:16,height:16}}/><input placeholder={t('search')} readOnly/><kbd>⌘K</kbd></div>
        <button className="iconbtn" onClick={()=>setNotif(!notif)}><I.bell style={{width:19,height:19}}/><span className="dot"/></button>
        {notif&&<div className="notif-panel"><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px'}}><b style={{fontSize:15}}>{t('notifications')}</b><button style={{fontSize:12.5,color:'var(--accent)',fontWeight:560}} onClick={()=>setNotif(false)}>{t('markRead')}</button></div>
          {NOTIFS.map((n,i)=><div className="notif" key={i}>{n.unread?<span className="nd"/>:<span style={{width:8,flex:'0 0 8px'}}/>}<div><div style={{fontSize:13,lineHeight:1.4}}>{n.text}</div><div style={{fontSize:11.5,color:'var(--text-3)',marginTop:3}}>{n.time}</div></div></div>)}</div>}
      </header>
      {page==='dashboard'&&<Dashboard role={role} go={go} name={prof.name}/>}
      {page==='projects'&&<Projects role={role} go={go} toast={toast}/>}
      {page==='review'&&<ReviewStudio role={role} toast={toast} initialSub={reviewSub}/>}
      {page==='project'&&activeProject&&<ProjectDetail p={activeProject} role={role} go={go} toast={toast}/>}
      {page==='requests'&&<Requests role={role} toast={toast}/>}
      {page==='contracts'&&<Contracts role={role} toast={toast}/>}
      {page==='invoices'&&(role==='client'?<ClientInvoices toast={toast}/>:<Invoices role={role} toast={toast}/>)}
      {page==='payments'&&<Payments role={role} toast={toast}/>}
      {page==='accounting'&&<Accounting role={role}/>}
      {page==='earnings'&&<Payments role={role} toast={toast}/>}
      {page==='calendar'&&<Calendar/>}
      {page==='drive'&&(role==='client'?<MyFiles role={role} toast={toast}/>:<DriveView role={role} toast={toast}/>)}
      {page==='users'&&role==='admin'&&<UsersManage toast={toast} isSuper={isSuper}/>}
      {page==='import'&&role==='admin'&&<ImportView toast={toast}/>}
      {page==='settings'&&<Settings lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} toast={toast} isSuper={isSuper} role={role}/>}
    </main>
    {cmdk&&<CommandPalette close={()=>setCmdk(false)} go={go} setTheme={setTheme} theme={theme} nav={nav}/>}
    {newP&&<NewProject close={()=>setNewP(false)} toast={toast}/>}
    {toastMsg&&<div className="toast"><I.check style={{width:17,height:17,color:'var(--green)'}}/>{toastMsg}</div>}
  </div>;
}

function App(){
  const[role,setRole]=useState(null);const[isSuper,setIsSuper]=useState(false);const[lang,setLang]=useState('en');const[theme,setTheme]=useState('light');
  useEffect(()=>{document.body.className=theme==='dark'?'dark':'';},[theme]);
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);
  useEffect(()=>{
    if(!supa)return;
    const apply=async(s)=>{ if(!s)return; let r='client';
      try{const {data}=await supa.from('profiles').select('role').eq('id',s.user.id).single(); if(data&&data.role)r=data.role;}catch(e){}
      setIsSuper(r==='superadmin');setRole(r==='superadmin'?'admin':r);
    };
    supa.auth.getSession().then(({data})=>apply(data.session));
    const {data:sub}=supa.auth.onAuthStateChange((_e,s)=>apply(s));
    return ()=>{try{sub.subscription.unsubscribe();}catch(e){}};
  },[]);
  const signOut=async()=>{ try{if(supa)await supa.auth.signOut();}catch(e){} setRole(null);setIsSuper(false); };
  const t=useMemo(()=>makeT(lang),[lang]);
  const onboard=(()=>{try{return new URLSearchParams(location.search).get('onboard');}catch(_){return null;}})();
  return <LangCtx.Provider value={{lang,t}}>
    {onboard?<Onboarding token={onboard}/>:(role?<Shell role={role} setRole={signOut} isSuper={isSuper} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}/>:<Login onPick={(id)=>{setIsSuper(id==='superadmin');setRole(id==='superadmin'?'admin':id);}} lang={lang} setLang={setLang}/>)}
  </LangCtx.Provider>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
//SENTINEL_APP
