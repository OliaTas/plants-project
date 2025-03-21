import { DeliveryType } from "./delivery.type"
import { PaymentType } from "./payment.type"

export type UserType = {
    deliveryType?: DeliveryType
    firstName?: string,
    lastName?: string,
    phone?: string,
    fatherName?: string,
    paymentType?: PaymentType,
    email: string,
    street?: string,
    house?: string,
    entrance?: string,
    apartment?: string,

}