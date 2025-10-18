import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import NavBar from "@/components/NavBar";

const OwnerDetails = () => {
    const basicInfoForm = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            personalAddress: '',
            contactNumber: '',
            email: '',
            genderId: '',
            numTenantProperties: 1,
            tenantProperties: [{
                propertyType: '',
                address: '',
                totalRooms: '',
                filledRooms: '',
                emptyRooms: ''
            }],
        },
    });

    const {
        control: basicControl,
        handleSubmit: handleBasicSubmit,
        watch: watchBasic,
        setValue: setBasicValue
    } = basicInfoForm;

    const numTenantProperties = watchBasic('numTenantProperties');
    const tenantProperties = watchBasic('tenantProperties') || [];

    useEffect(() => {
        const count = parseInt(numTenantProperties, 10) || 0;
        const currentCount = tenantProperties.length;
        if (count > currentCount) {
            const newProperties = Array.from({ length: count - currentCount }, () => ({
                propertyType: '',
                address: '',
                totalRooms: '',
                filledRooms: '',
                emptyRooms: ''
            }));
            setBasicValue('tenantProperties', [...tenantProperties, ...newProperties]);
        } else if (count < currentCount) {
            setBasicValue('tenantProperties', tenantProperties.slice(0, count));
        }
    }, [numTenantProperties, tenantProperties.length, setBasicValue]);

    const calculateEmptyRooms = (totalRooms, filledRooms) => {
        const total = parseInt(totalRooms) || 0;
        const filled = parseInt(filledRooms) || 0;
        return total - filled >= 0 ? total - filled : 0;
    };

    useEffect(() => {
        const subscription = watchBasic((value, { name }) => {
            if (name && name.startsWith('tenantProperties')) {
                const match = name.match(/tenantProperties\.(\d+)\.(totalRooms|filledRooms)/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const totalRooms = value.tenantProperties?.[index]?.totalRooms || '0';
                    const filledRooms = value.tenantProperties?.[index]?.filledRooms || '0';
                    const empty = calculateEmptyRooms(totalRooms, filledRooms).toString();
                    setBasicValue(`tenantProperties.${index}.emptyRooms`, empty, { shouldDirty: false });
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watchBasic, setBasicValue]);

    const onBasicSubmit = (data) => {
        console.log('Basic Information Data:', data);
        toast('Basic Information submitted successfully!', {
            description: 'Your details have been saved.',
            style: { background: '#2ec5bc', color: '#000' },
        });
    };

    const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse'];
    const genderOptions = ['Male', 'Female', 'Other'];

    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="max-w-5xl mx-auto p-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...basicInfoForm}>
                            <form onSubmit={handleBasicSubmit(onBasicSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={basicControl}
                                        name="firstName"
                                        rules={{ required: 'First Name is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input required placeholder="Enter your first name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={basicControl}
                                        name="lastName"
                                        rules={{ required: 'Last Name is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input required placeholder="Enter your last name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={basicControl}
                                    name="personalAddress"
                                    rules={{ required: 'Personal Address is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personal Address<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Enter your personal address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Gender + Number of Tenant Properties */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={basicControl}
                                        name="gender"
                                        rules={{ required: 'Gender is required' }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender<span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {genderOptions.map((option) => (
                                                            <SelectItem key={option} value={option}>
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={basicControl}
                                        name="numTenantProperties"
                                        rules={{
                                            required: 'Number of Tenant Properties is required',
                                            min: { value: 1, message: 'Minimum 1 tenant property is required' },
                                            pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Tenant Properties<span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="Enter number of tenant properties"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Tenant Property Section */}
                                {parseInt(numTenantProperties, 10) > 0 && (
                                    <Card className="space-y-4 bg-gray-50 p-4 rounded-md" style={{ backgroundColor: '#ededed' }}>
                                        <h3 className="font-medium text-lg">Properties Details</h3>
                                        <div className="hidden sm:grid grid-cols-5 gap-3 mb-2">
                                            <FormLabel className="font-medium">Address<span className="text-red-500">*</span></FormLabel>
                                            <FormLabel className="font-medium">Property Type<span className="text-red-500">*</span></FormLabel>
                                            <FormLabel className="font-medium">Total Rooms<span className="text-red-500">*</span></FormLabel>
                                            <FormLabel className="font-medium">Occupied Rooms<span className="text-red-500">*</span></FormLabel>
                                            <FormLabel className="font-medium">Empty Rooms</FormLabel>
                                        </div>
                                        {Array.from({ length: parseInt(numTenantProperties) || 0 }).map((_, index) => (
                                            <div key={tenantProperties[index]?.id || index} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-3 border-b pb-4 sm:pb-0 sm:border-0">
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantProperties.${index}.address`}
                                                    rules={{ required: 'Address is required' }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Address*" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantProperties.${index}.propertyType`}
                                                    rules={{ required: 'Property Type is required' }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select*" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {propertyTypes.map((type) => (
                                                                        <SelectItem key={type} value={type}>
                                                                            {type}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantProperties.${index}.totalRooms`}
                                                    rules={{
                                                        required: 'Total Rooms is required',
                                                        pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                                    }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" min="0" placeholder="Total Rooms*" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantProperties.${index}.filledRooms`}
                                                    rules={{
                                                        required: 'Occupied Rooms is required',
                                                        pattern: { value: /^[0-9]+$/, message: 'Enter a valid number' },
                                                        validate: (value) => {
                                                            const total = parseInt(watchBasic(`tenantProperties.${index}.totalRooms`)) || 0;
                                                            return parseInt(value) <= total || 'Occupied cannot exceed Total';
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" min="0" placeholder="Occupied Rooms*" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={basicControl}
                                                    name={`tenantProperties.${index}.emptyRooms`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input disabled className="bg-gray-200" placeholder="Auto-calculated" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </Card>
                                )}

                                {/* Contact + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={basicControl}
                                        name="contactNumber"
                                        rules={{
                                            required: 'Contact Number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Enter a valid 10-digit phone number',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="Enter your contact number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={basicControl}
                                        name="email"
                                        rules={{
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Enter a valid email address',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                                >
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OwnerDetails;