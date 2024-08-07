import React, { ChangeEvent, useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { NXAlertCircle, NXPlus } from "../../icons";
import "./select-hide.css";
import SelectStyled from "../Select";
import NestedSelect from "../nestedSelect";
import useApi from "../../api";
import { makeCategoryEnumFriendly, makeEnumFriendly } from "../../enum";
import VariantSection from "./VariantSection";
import { ImageField } from "../images";
import { toast } from 'react-toastify';
import EditorField from "../editor/EditorJS";
import SEO from "../seo/SEO";
import PageBodyWrapper from "../../components/PageBodyWrapper";
import { handleRetriveError } from "../../utils";

import { NXForm, InputField } from "../../components/common";



function AddNewProductMain() {
  const api = useApi();
  const navigate = useNavigate();

  // fetched data
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [ProductType, setProductType] = useState<any[]>([]);
  const [productTags, setProductTags] = useState<any[]>([]);
  const [collection, setCollection] = useState<any[]>([]);

  const [errorData, setErrorData] = useState<any>({});



  const [fromData, setFormData] = useState<any>({});
  const [productConfig, setProductConfig] = useState<any>({});
  const [variantSection, setVariantSection] = useState<number>(1);

  const handleProductCreate = (event: FormEvent) => {
    event.preventDefault()
    api.createProduct(fromData).then((response:any) => {
      toast.success("Product Created Successfully!");
      navigate(`/dashboard/products/edit/${response.id}`); 
    }, (error) => {
      setErrorData(error.response.data);
    })
  };

  const handleProductConfig = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setProductConfig((prevData: any) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };


  const addNewVariant = (event: any) => {
    event.preventDefault();
    setVariantSection(prevVariantSection => prevVariantSection + 1);
  }

  const fetchData = () => {
    api.getRecursiveCategories().then((response) => {
      const category = makeCategoryEnumFriendly(response as any);
      setCategories(category);
    }, handleRetriveError);

    api.getColor().then((response) => {
      setColors(response as any);
    }, handleRetriveError);

    api.getProductType().then((response) => {
      setProductType(response as any);
    }, handleRetriveError);

    api.getProductTags().then((response) => {
      setProductTags(response as any);
    }, handleRetriveError);

    api.getCollections().then((response) => {
      setCollection(response as any);
    }, handleRetriveError);

  };


  useEffect(() => {
    fetchData();
  }, []);

  const deleteVariant = (event: any) => {
    event.preventDefault();
    setVariantSection(prevVariantSection => prevVariantSection - 1);
  };


  const onChangeHandler = (event: ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const onVariantChange = (data: any, index: number) => {
    setFormData((prevFormData: any) => {
      const updatedVariants = [...(prevFormData.variants_payload || [])];
      updatedVariants[index] = data;
  
      return {
        ...prevFormData,
        variants_payload: updatedVariants
      };
    });
  };
  

  const handleSingleChange = (name: any, value: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  return (
    <PageBodyWrapper bgClass="">
      {/* top action button */}
      <div className="hidden md:flex md:justify-end md:gap-5 md:mb-5">
        <button className="text-[#0CAF60] border border-[#0CAF60] px-10 py-3 rounded-xl font-nunito font-[900]">
          Discard
        </button>
        <button
          className="text-white bg-[#0CAF60] px-10 py-3 rounded-xl font-nunito font-[900] disabled:bg-[#0caf609a]"
          onClick={handleProductCreate}
        >
          Save
        </button>
      </div>
      {/* body */}
      <div className="flex flex-col justify-center md:flex-row gap-5">
        <div className="w-full md:w-[60%]">
          <div className="bg-white p-5 rounded-md">
            <div className="flex items-center gap-3">
              <h1 className="font-nunito font-[900] text-2xl">
                Product Information
              </h1>
              <NXAlertCircle className="text-base-300" />
            </div>
            <div className="my-5">
              <label htmlFor="product_name">Product Name</label>
              <InputField
                type="text"
                id="product_name"
                name="name"
                onChange={onChangeHandler}
                placeholder="Type your product name"
                className="w-full px-5 py-3 bg-secondary-50 mt-3 rounded-xl font-nunito outline-[#0CAF60] border-[2px] border-dashed"
                errorData={errorData}
              />
            </div>
            <div className="my-5">
              <label htmlFor="summary">summary</label>
              <InputField
                type="text"
                id="summary"
                name="summary"
                onChange={onChangeHandler}
                errorData={errorData}
                placeholder="Type product summary"
                className="w-full px-5 py-3 bg-secondary-50 mt-3 rounded-xl font-nunito outline-[#0CAF60] border-[2px] border-dashed"
              />
            </div>

            <div className="mt-5">
              <div className="flex flex-col gap-3">
                <label htmlFor="product_description">Description</label>
                <EditorField name="description" errorData={errorData} onChange={(content) => handleSingleChange('description', JSON.stringify(content))}/>
              </div>
            </div>
          </div>

         
         <ImageField isMull={true}  label="Images" name="images" onChange={(name: string, data:any) => handleSingleChange(name, data.map((image: any) => image.id))} />

          {/* tax class */}
          {productConfig.charge_tax && (
          <div className=" bg-white p-5 rounded-md mt-5">
            <div>
              <h1 className="font-nunito font-[900] text-2xl">Tax Class</h1>
            </div>

            <p>Tax Class Dropdown goes there</p>
          </div>)}
          {/* tax class end */}

          {/* tax class */}
          {productConfig.physical_product && (
          <div className=" bg-white p-5 rounded-md mt-5">
            <div>
              <h1 className="font-nunito font-[900] text-2xl">Shipping</h1>
            </div>

            <p>Shipping Handler goes there</p>
          </div>)}
          {/* tax class end */}

          <div className="bg-white p-5 rounded-md mt-5">
            {Array.from({ length: variantSection }, (_, index) => (
              <VariantSection
                key={index}
                productConfig={productConfig}
                onChange={onVariantChange}
                serial={index + 1}
                colors={colors}
                deleteVariant={deleteVariant}
                errorData={errorData}
                name='variants_payload'
              />
           ))}

            {productConfig.has_variant && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={addNewVariant}
                  className="flex items-center font-nunito font-[800] gap-2 px-5 py-3 bg-primary-500 text-white rounded-xl"
                >
                  <NXPlus className="mr-1" /> Add Variant
                </button>
              </div>
            )}

          </div>
          <div className="bg-white p-5 rounded-md mt-5">
            <SEO seoData={fromData} onChange={onChangeHandler}/>
          </div>

        </div>


        <div className="w-full md:w-[40%]">
          <div className=" bg-white p-5 rounded-md">
            <div>
              <h1 className="font-nunito font-[900] text-2xl">Status</h1>
            </div>
            <div className="w-full mt-3">
              <SelectStyled
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "InActive" },
                ]}
              />
              <div className="absolute inset-y-0 right-0 top-10 flex items-center px-2 pointer-events-none"></div>
            </div>
          </div>
          {/* publishing */}
          <div className=" bg-white p-5 rounded-md mt-5">
            <div className="flex items-center gap-3">
              <h1 className="font-nunito font-[900] text-2xl">Publishing</h1>
              <NXAlertCircle className="text-base-300" />
            </div>
            <p className="font-bold mt-7">Sales channels</p>

            <div className="flex gap-2 items-center mt-3">
              <input type="checkbox" name="" id="sales-channel" />
              <label htmlFor="sales-channel">Sales channels</label>
            </div>
            <div className="flex gap-2 items-start mt-3">
              <input type="checkbox" name="" id="sales-channel" />
              <label htmlFor="sales-channel">
                Point of Sale <br />
                <span className="text-sm">
                  Point of Sale has not been set up.
                </span>
                <br />
                <span className="text-sm">
                  Finish the remaining steps to start selling in person.
                </span>
              </label>
            </div>
          </div>
          {/* product organization */}
          <div className=" bg-white p-5 rounded-md mt-5">
            <div className="flex items-center gap-3">
              <h1 className="font-nunito font-[900] text-2xl">
                Product organization
              </h1>
              <NXAlertCircle className="text-base-300" />
            </div>

            <div className="w-full mt-10">
              <label htmlFor="category">Category</label>
              <div className="pt-3">
                <NestedSelect  onChange={(e) => handleSingleChange('categories', e.value)} options={categories} />
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="tags">Tags</label>
              <div className="pt-3">
                <SelectStyled errorData={errorData} name='tags' isMulti={true} />
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="tags">Collection</label>
              <div className="pt-3">
                <SelectStyled
                  isMulti={true}
                  options={makeEnumFriendly(collection)}
                  onChange={(e) => handleSingleChange('collections', e.value)}
                  errorData={errorData}
                />
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="tags">Product Type</label>
              <div className="pt-3">
                <SelectStyled
                  name='product_type'
                  options={makeEnumFriendly(ProductType)}
                  onChange={(e) => handleSingleChange('product_type', e.value)}
                  errorData={errorData}
                />
              </div>
            </div>
          </div>

          {/* Product Control */}
          <div className=" bg-white p-5 rounded-md mt-5">
            <div>
              <h1 className="font-nunito font-[900] text-2xl">Product Control</h1>
            </div>

            <div className="flex items-center gap-3 my-5">
              <input onChange={handleProductConfig} type="checkbox" name="charge_tax" />
              <label className="font-nunito">Charge tax</label>
            </div>
            <div className="flex items-center gap-3 my-5">
            <input onChange={handleProductConfig} type="checkbox" name="physical_product" />
              <label className="font-nunito">Physical Product</label>
            </div>
            <div className="flex items-center gap-3 my-5">
            <input onChange={handleProductConfig} type="checkbox" name="track_stock" />
              <label className="font-nunito">Track Stock</label>
            </div>
            <div className="flex items-center gap-3 my-5">
            <input onChange={handleProductConfig} type="checkbox" name="has_variant" />
              <label className="font-nunito">Has Variant</label>
            </div>
          </div>

        </div>


        <div className="flex flex-col-reverse justify-center gap-5 mb-5 md:hidden">
          <button className="text-[#0CAF60] border border-[#0CAF60] px-10 py-3 rounded-xl font-nunito font-[900]">
            Discard
          </button>
          <button
            className="text-white bg-[#0CAF60] px-10 py-3 rounded-xl font-nunito font-[900] disabled:bg-[#0caf609a]"
            disabled
          >
            Save
          </button>
        </div>
      </div>
    </PageBodyWrapper>
  );
}

export default AddNewProductMain;
