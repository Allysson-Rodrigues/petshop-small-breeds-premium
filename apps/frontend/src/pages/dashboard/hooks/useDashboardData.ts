import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { dashboardService } from "../../../services/dashboardService";
import type {
	AdminDashboardData,
	ApiAppointment,
	ApiBookingRequest,
	ApiClient,
	ApiPet,
	ApiProduct,
	DashboardData,
} from "../../../types/api";
import {
	appendDashboardItem,
	createAppointmentsResource,
	removeDashboardItem,
	type AppointmentsResourceData,
	type DashboardEntity,
	updateDashboardItem,
} from "./dashboardDataState";
import {
	buildAdminNotifications,
	buildCustomerNotifications,
	type DashboardNotification,
} from "./dashboardNotifications";

type ShowToast = (message: string) => void;

interface DashboardResourceOptions<T> {
	enabled?: boolean;
	initialValue: T;
	load: () => Promise<T>;
	loadErrorMessage: string;
	reloadKey?: unknown;
	showToast: ShowToast;
}

interface DashboardResourceResult<T> {
	data: T;
	loading: boolean;
	refresh: () => Promise<void>;
	setData: Dispatch<SetStateAction<T>>;
}

interface DashboardCollectionResult<T extends DashboardEntity> {
	addItem: (item: T) => void;
	items: T[];
	loading: boolean;
	refresh: () => Promise<void>;
	removeItem: (id: string) => void;
	setItems: Dispatch<SetStateAction<T[]>>;
	updateItem: (id: string, updater: (currentItem: T) => T) => void;
}

function useDashboardResource<T>({
	enabled = true,
	initialValue,
	load,
	loadErrorMessage,
	reloadKey,
	showToast,
}: DashboardResourceOptions<T>): DashboardResourceResult<T> {
	const [data, setData] = useState<T>(initialValue);
	const [loading, setLoading] = useState(enabled);
	const loadRef = useRef(load);
	const showToastRef = useRef(showToast);
	const loadErrorMessageRef = useRef(loadErrorMessage);

	useEffect(() => {
		loadRef.current = load;
	}, [load]);

	useEffect(() => {
		showToastRef.current = showToast;
		loadErrorMessageRef.current = loadErrorMessage;
	}, [loadErrorMessage, showToast]);

	const refresh = useCallback(async () => {
		if (!enabled) {
			setLoading(false);
			return;
		}

		setLoading(true);

		try {
			const nextData = await loadRef.current();
			setData(nextData);
		} catch {
			showToastRef.current(loadErrorMessageRef.current);
		} finally {
			setLoading(false);
		}
	}, [enabled]);

	useEffect(() => {
		if (!enabled) {
			setLoading(false);
			return;
		}

		void refresh();
	}, [enabled, refresh, reloadKey]);

	return {
		data,
		loading,
		refresh,
		setData,
	};
}

function useDashboardCollection<T extends DashboardEntity>(
	options: Omit<DashboardResourceOptions<T[]>, "initialValue">,
): DashboardCollectionResult<T> {
	const { data, loading, refresh, setData } = useDashboardResource<T[]>({
		...options,
		initialValue: [],
	});

	return {
		addItem: (item) => {
			setData((currentItems) => appendDashboardItem(currentItems, item));
		},
		items: data,
		loading,
		refresh,
		removeItem: (id) => {
			setData((currentItems) => removeDashboardItem(currentItems, id));
		},
		setItems: setData,
		updateItem: (id, updater) => {
			setData((currentItems) =>
				updateDashboardItem(currentItems, id, updater),
			);
		},
	};
}

export function useOverviewData(isAdmin: boolean, showToast: ShowToast) {
	const adminDashboard = useDashboardResource<AdminDashboardData | null>({
		enabled: isAdmin,
		initialValue: null,
		load: () => dashboardService.getAdminDashboard(),
		loadErrorMessage: "Falha ao carregar indicadores de admin.",
		reloadKey: isAdmin,
		showToast,
	});

	const customerDashboard = useDashboardResource<DashboardData | null>({
		enabled: !isAdmin,
		initialValue: null,
		load: () => dashboardService.getDashboard(),
		loadErrorMessage: "Falha ao carregar dashboard.",
		reloadKey: isAdmin,
		showToast,
	});

	return {
		adminData: isAdmin ? adminDashboard.data : null,
		data: isAdmin ? null : customerDashboard.data,
		loading: isAdmin ? adminDashboard.loading : customerDashboard.loading,
		refresh: isAdmin ? adminDashboard.refresh : customerDashboard.refresh,
	};
}

export function useDashboardNotifications(
	isAdmin: boolean,
	showToast: ShowToast,
	enabled = true,
) {
	const adminNotifications = useDashboardResource<DashboardNotification[]>({
		enabled: enabled && isAdmin,
		initialValue: [],
		load: async () =>
			buildAdminNotifications(await dashboardService.getAdminDashboard()),
		loadErrorMessage: "Falha ao carregar notificações do painel.",
		reloadKey: isAdmin,
		showToast,
	});

	const customerNotifications = useDashboardResource<DashboardNotification[]>({
		enabled: enabled && !isAdmin,
		initialValue: [],
		load: async () =>
			buildCustomerNotifications(await dashboardService.getDashboard()),
		loadErrorMessage: "Falha ao carregar notificações do painel.",
		reloadKey: isAdmin,
		showToast,
	});

	return {
		loading:
			enabled &&
			(isAdmin ? adminNotifications.loading : customerNotifications.loading),
		notifications: isAdmin
			? adminNotifications.data
			: customerNotifications.data,
		refresh: isAdmin ? adminNotifications.refresh : customerNotifications.refresh,
	};
}

export function useClientsData(showToast: ShowToast) {
	const collection = useDashboardCollection<ApiClient>({
		load: () => dashboardService.getClients(),
		loadErrorMessage: "Falha ao carregar clientes.",
		showToast,
	});

	return {
		addClient: collection.addItem,
		clients: collection.items,
		loading: collection.loading,
		refresh: collection.refresh,
		removeClient: collection.removeItem,
		setClients: collection.setItems,
		updateClientInList: collection.updateItem,
	};
}

export function useBookingRequestsData(
	showToast: ShowToast,
	enabled = true,
) {
	const collection = useDashboardCollection<ApiBookingRequest>({
		enabled,
		load: () => dashboardService.getBookingRequests(),
		loadErrorMessage: "Falha ao carregar solicitações públicas.",
		showToast,
	});

	return {
		bookingRequests: collection.items,
		loading: collection.loading,
		refresh: collection.refresh,
		setBookingRequests: collection.setItems,
		updateBookingRequestInList: collection.updateItem,
	};
}

export function usePetsData(showToast: ShowToast) {
	const collection = useDashboardCollection<ApiPet>({
		load: () => dashboardService.getPets(),
		loadErrorMessage: "Falha ao carregar pets.",
		showToast,
	});

	return {
		addPet: collection.addItem,
		loading: collection.loading,
		pets: collection.items,
		refresh: collection.refresh,
		removePet: collection.removeItem,
		setPets: collection.setItems,
		updatePetInList: collection.updateItem,
	};
}

export function useAppointmentsData(showToast: ShowToast) {
	const { data, loading, refresh, setData } =
		useDashboardResource<AppointmentsResourceData>({
			initialValue: {
				appointments: [],
				pets: [],
			},
			load: async () => {
				const [appointments, pets] = await Promise.all([
					dashboardService.getAppointments(),
					dashboardService.getPets(),
				]);

				return createAppointmentsResource(appointments, pets);
			},
			loadErrorMessage: "Falha ao carregar agendamentos.",
			showToast,
		});

	return {
		addAppointment: (appointment: ApiAppointment) => {
			setData((currentData) => ({
				...currentData,
				appointments: appendDashboardItem(
					currentData.appointments,
					appointment,
				),
			}));
		},
		appointments: data.appointments,
		loading,
		pets: data.pets,
		refresh,
		removeAppointment: (id: string) => {
			setData((currentData) => ({
				...currentData,
				appointments: removeDashboardItem(currentData.appointments, id),
			}));
		},
		updateAppointmentInList: (
			id: string,
			updater: (currentAppointment: ApiAppointment) => ApiAppointment,
		) => {
			setData((currentData) => ({
				...currentData,
				appointments: updateDashboardItem(
					currentData.appointments,
					id,
					updater,
				),
			}));
		},
	};
}

export function useInventoryData(showToast: ShowToast) {
	const collection = useDashboardCollection<ApiProduct>({
		load: () => dashboardService.getProducts(),
		loadErrorMessage: "Falha ao carregar estoque.",
		showToast,
	});

	return {
		addProduct: collection.addItem,
		loading: collection.loading,
		products: collection.items,
		refresh: collection.refresh,
		removeProduct: collection.removeItem,
		setProducts: collection.setItems,
		updateProductInList: collection.updateItem,
	};
}
