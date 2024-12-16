export interface ISubmitOrder {
  /**
   * The quantity of items in the order. Maximum of 50.
   */
  quantity: number;

  /**
   * The package ID associated with the order. Obtainable from the "Packages / Get Packages" endpoint.
   */
  package_id: string;

  /**
   * The type of order. The only possible value is "sim". Default is "sim" if left empty.
   */
  type?: string;

  /**
   * A custom description for the order to help identify it later.
   */
  description?: string;

  /**
   * The brand under which the eSIM should be shared. Null for unbranded.
   */
  brand_settings_name?: string | null;

  /**
   * Email address to send the eSIM sharing information. If specified, sharing_option should also be set.
   */
  to_email?: string;

  /**
   * Array of sharing options required when to_email is set. Available options: link, pdf.
   */
  sharing_option?: string[];

  /**
   * Array of email addresses to copy when to_email is set.
   */
  copy_address?: string[];
}

export interface ICreateOrder extends ISubmitOrder {
  userId: string;
  transactionId: string;
}
